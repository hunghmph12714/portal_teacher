<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Account;
use App\Transaction;
use App\Tag;
use App\Classes;
use App\Course;
use App\Session;
use App\Teacher;
use App\Paper;
use DateTime;
use DateInterval;
use DatePeriod;
use DB;
use App\StudentSession;
class ReportController extends Controller
{
    //
    public function deleteTransaction(){
        Transaction::where('refer_transaction', '-1')->forceDelete();
        StudentSession::where('checked', 1)->update(array('checked' => 0));
        
    }
    public function generateRevenue(){
        $classes = Classes::where('type', 'class')->offset(160)->limit(40)->get();
        foreach($classes as $class){
            $sessions = $class->sessions()->where('status', '0')->whereBetween('date', ['2021-03-01', '2021-04-24'])->get();
            foreach($sessions as $session){
            
                $students = $session->students()->wherePivot('checked', '0')->get();
                // echo "<pre>";
                // print_r($students->toArray());
                foreach($students as $student){
                    $revenue = 0;
                    $acc_131 = Account::where('level_2', '131')->first()->id;                
                    $fee = $session->transactions()->where('student_id', $student->id)->get();
                    foreach($fee as $f){
                        if($f->debit == $acc_131){
                            $revenue += $f->pivot['amount'];
                        }
                        if($f->credit == $acc_131){
                            $revenue -= $f->pivot['amount'];
                        }
                    }
                    if($revenue > 0){
                        $input['debit'] = Account::where('level_2', '3387')->first()->id;
                        $input['credit'] = Account::where('level_2', '511')->first()->id;
                        $input['amount'] = $revenue;
                        $input['time'] = $session->date;
                        $input['content'] = 'Doanh thu lớp học';
                        $input['class_id'] = $class->id;
                        $input['student_id'] = $student->id;
                        $input['session_id'] = $session->id;
                        $input['created_at'] = $session->date;
                        $input['updated_at'] = $session->date;
                        $input['center_id'] = $session->center_id;
                        $input['refer_transaction'] = -1;
                        Transaction::create($input);
                        // echo "<pre>";
                        // print_r($input);
                    }
                    // print_r($student->pivot['id']);
                    $ss = StudentSession::find($student->pivot['id']);
                    if($ss){
                        $ss->checked = 1; 
                        $ss->save();
                    }
                    $session->status = '1';
                    $session->save();
                }
            }
        }
        
        return response()->json($classes->toArray());
    }
    protected function getFinancial(){
        // $class_id = 45;
        // $month = '09';
        // $result = $this->report($class_id, $month);

        // print_r($result);
        $classes = Classes::where('student_number', '>' , 1)->get();
        $result = [];
        foreach($classes as $class){
            $grade = Course::find($class->course_id)->grade;
            $report_08 = $this->report($class->id, '08');
            $report_09 = $this->report($class->id, '09');
            $result[] = ['class' => $class->code , 'grade' => $grade , 't8' => $report_08, 't9' => $report_09];
        }
        return response()->json($result);
    }
    public function report($class_id, $month){
        $transactions = Transaction::where('class_id', $class_id)->whereMonth('time', $month)->get();
            $hp = 0;
            $dd = 0;
            $no = 0;
            $gc = 0;
        foreach($transactions as $t){
            //hp 
            $acc_no = Account::where('level_2', '131')->first()->id;
            $dtcth = Account::where('level_2','3387')->first()->id;
            $dt = Account::where('level_2', '511')->first()->id;
            
            // print_r($t->debit);
            if($t->debit == $acc_no){
                $hp += $t->amount;
            }
            if(($t->debit == $dtcth || $t->debit == $dt) && $t->credit == $acc_no){
                $hp -= $t->amount;
            }
            //DD
            $acc = Account::where('type','equity')->get('id')->toArray();
            
            if(in_array($t->debit, array_column($acc, 'id')) && $t->credit == $acc_no){
                $dd += $t->amount;
            }
            //giữ chỗ
            $tag = Tag::where('name', 'Giữ chỗ')->first()->id;
            $t_tag = $t->tags->toArray();
            if($t_tag){
                foreach($t_tag as $tt){
                    if($tt['id'] == $tag){
                        $gc += $t->amount;
                    }
                }
            }
        }
        $no = $hp - $dd + $gc;
        return ['cd' => $hp, 'dd'=> $dd , 'gc' => $gc, 'no' => $no];

    }
    public function getRevenueSession(Session $session){
        $teacher = Teacher::find($session->teacher_id);
        $class = Classes::find($session->class_id);
        $result = ['present' => 0, 'holding' => 0, 'absence' => 0, 'n_absence' => 0, 'revenue' => 0, 'discount'=>0 , 'date' => date('d-m-Y', strtotime($session->date)), 'teacher' => ($teacher)?$teacher->name:'', 'class'=>($class)?$class->code:''];
        if($session){
            
            $students = $session->students;
            // echo "<pre>";
            // print_r($students->toArray());
            foreach($students as $s){
                if($s->pivot['attendance'] == 'present'){
                    $result['present']++;
                    $transactions = $session->transactions()->where('student_id', $s->id)->get();
                    foreach($transactions as $t){
                        $tag = $t->tags()->first();
                        if($tag){
                            if($tag->name == 'Học phí'){
                                $result['revenue'] += $t->pivot['amount'];
                            }
                            if($tag->name == 'Miễn giảm'){
                                $result['discount'] += $t->pivot['amount'];
                                $result['revenue'] -= $t->pivot['amount'];
                            }
                            if($tag->name == 'Điều chỉnh'){
                                $acc_131 = Account::where('level_2', '131')->first()->id;
                                // $acc_3387 = Account::where('level_1', '3387')->first()->id;
                                if($t->debit == $acc_131){
                                    $result['revenue'] += $t->pivot['amount'];
                                }
                                if($t->credit == $acc_131){
                                    $result['revenue'] -= $t->pivot['amount'];
                                }
                            }
                        }
                    }
                }
                if($s->pivot['attendance'] == 'holding'){
                    $result['holding']++;
                }
                if($s->pivot['attendance'] == 'absence'){
                    $result['absence']++;
                }
                if($s->pivot['attendance'] == 'n_absence'){
                    $result['n_absence']++;
                }

            }
        }
        return $result;
    }
    public function getRevenue(Request $request){
        $rules = ['from' => 'required', 'to' => 'required'];
        $this->validate($request, $rules);
        $from = date('Y-m-d', strtotime($request->from));
        $to = date('Y-m-d', strtotime($request->to));
        $result = [];
        if($request->class && !$request->teacher){
            $class_id = $request->class['value'];
            
            switch ($class_id) {
                case '-1':
                    # Tat ca class...
                    $classes = Classes::all();                    
                    break;

                case 'ty':
                    $classes = Classes::where('center_id', 5)->orWhere('center_id', 1)->get();
                    break;

                case 'tdh':
                    # code...
                    $classes = Classes::where('center_id', 2)->orWhere('center_id', 4)->get();
                    break;
                
                case 'ptt':
                    $classes = Classes::where('center_id', 3)->get();
                    break;
                default:
                    $classes = Classes::where('id',$request->class['value'])->get();
                    break;
            }
            foreach($classes as $c){
                $sessions = Session::Where('class_id', $c->id)->whereBetween('date',[$from, $to])->get();
                foreach($sessions as $ss){
                    $result[] = $this->getRevenueSession($ss);
                }
            }
            
        }
        if($request->teacher){
            $sessions = Session::Where('teacher_id', $request->teacher['value'])->whereBetween('date',[$from, $to])->orderBy('class_id')->orderBy('date','ASC')->get();
            foreach($sessions as $ss){
                $result[] = $this->getRevenueSession($ss);
            }
        }

        // $session_id = 2703;
        // $session = Session::find($session_id);
        return response()->json($result);     
    }
    public function cashFlow(Request $request){
        
        $rules = ['centers' => 'required', 'from' => 'required', 'to'=> 'required'];
        $this->validate($request, $rules);

        
        $from = date('Y-m-d 00:00:00', strtotime($request->from));
        $to = date('Y-m-d 23:59:59', strtotime($request->to));
        $center_id = array_column($request->centers, 'value');

        $start    = (new DateTime($from))->modify('first day of this month');
        $end      = (new DateTime($to))->modify('last day of this month');
        $interval = DateInterval::createFromDateString('1 month');
        $period   = new DatePeriod($start, $interval, $end);

        $pattern = [];
        foreach ($period as $dt){
            $month = $dt->format("m");
            for ($i = 0; $i < 5; $i++) {
                $pattern[$month.".".($i + 1)] = 0;
            }
            $pattern['sum-'.$month] = 0;
        }
        $pattern['Tổng']  = 0;
        $result[] = array_merge(['name' => 'Tổng'], $pattern);
        foreach ($period as $dt) {
            $month = $dt->format("m");
            $from = $dt->format('Y-m-01');
            $to = $dt->format('Y-m-t');
            // $from = date('Y-m-d 00:00:00', strtotime('2021-03-01'));
            for ($i = 0; $i < 5; $i++) { 
                $f = ($i == 0)? $from :date('Y-m-d  00:00:00', strtotime($from. "+1 day"));
                $t = (date('Y-m-d 23:59:59', strtotime($f. "+6 day")) > $to) ? $to :date('Y-m-d 23:59:59', strtotime($f. "+6 day"));
                $from = $t;
    
                $equity = array_column(Account::select('id')->where('type', 'equity')->get()->toArray(), 'id') ;
                //
                $transactions = Transaction::WhereNotNull('paper_id')->whereIn('credit', $equity)
                                            ->whereBetween('time', [$f, $t])
                                            ->whereIn('center_id', $center_id)
                                            ->select('accounts.name', 'transactions.amount','transactions.debit', 'transactions.center_id')
                                            ->leftJoin('accounts', 'transactions.debit', 'accounts.id')
                                            ->get();
    
    
                foreach($transactions as $t){
                    if(!array_key_exists($t->debit, $result)){
                        $result[$t->debit] = array_merge(['name' => $t->name], $pattern);
                        $result[$t->debit][$month.".".($i+1)] += $t->amount;                        
                        $result[$t->debit]['sum-'.$month] += $t->amount;
                        $result[$t->debit]['Tổng'] += $t->amount;
                    }else{
                        $result[$t->debit][$month.".".($i+1)] += $t->amount;                                       
                        $result[$t->debit]['sum-'.$month] += $t->amount;
                        $result[$t->debit]['Tổng'] += $t->amount;
                    }
                    $result[0][$month.".".($i+1)] += $t->amount;
                    $result[0]['sum-'.$month] += $t->amount;
                    $result[0]['Tổng'] += $t->amount;
                }
            }
        }

        
        // echo "<pre>";
        // print_r($result);
        
        return response()->json(['col' =>
        array_keys($pattern), 'data' => array_values($result)]);
    }
    public function cashBook(Request $request){
        $rules = ['centers' => 'required', 'from' => 'required', 'to'=> 'required'];
        $this->validate($request, $rules);
  
        
        $from = date('Y-m-d 00:00:00', strtotime($request->from));
        $to = date('Y-m-d 23:59:59', strtotime($request->to));
        $center_id = array_column($request->centers, 'value');

        $equity = array_column(Account::select('id')->where('level_1', '111')->get()->toArray(), 'id') ; 
        $debit = Transaction::WhereIn('center_id', $center_id)->where('time', '<', $from)->whereIn('debit', $equity)->sum('amount');
        $credit = Transaction::WhereIn('center_id', $center_id)->where('time', '<', $from)->whereIn('credit', $equity)->sum('amount');

        $previous = $debit - $credit;
        $transactions = Transaction::whereIn('credit', $equity)->orwhereIn('debit', $equity)->Select(
            'transactions.id as id','transactions.amount' ,DB::raw("DATE_FORMAT(transactions.time, '%d/%m/%Y') as time_formated"),'transactions.time','transactions.content','transactions.created_at',
            'debit_account.id as debit_id','debit_account.level_1 as debit_level_1', 'debit_account.level_2 as debit_level_2', 'debit_account.name as debit_name', 'debit_account.type as debit_type',
            'credit_account.id as credit_id','credit_account.level_1 as credit_level_1','credit_account.level_2 as credit_level_2', 'credit_account.name as credit_name', 'credit_account.type as credit_type',
            'students.id as sid', 'students.fullname as sname','students.dob', 
            'classes.id as cid', 'classes.code as cname',
            'users.id as uid','users.name as uname','transactions.center_id',
            'papers.payment_number', 'papers.receipt_number','papers.type as ptype', 'papers.name as pname'
        )
            ->leftJoin('accounts as debit_account','transactions.debit','debit_account.id')
            ->leftJoin('accounts as credit_account','transactions.credit','credit_account.id')
            ->leftJoin('students','transactions.student_id','students.id')
            ->leftJoin('classes','transactions.class_id','classes.id')
            ->leftJoin('papers', 'transactions.paper_id', 'papers.id')
            ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('transactions.time', 'ASC')->get();
        $transactions = $transactions->WhereIn('center_id', $center_id)->whereBetween('time', [$from, $to]);
        
        $result[] = [
            'time' => '',
            'pt' => '', 'pc' => '', 'description' => '', 'op' => '', 'debit' => '', 'credit' => '', 'sum' => $previous, 'user' => ''
        ];
        foreach($transactions as $t){
            $input['time'] = $t->time_formated;
            if($t->credit_level_1 == '111'){
                $input['pt'] = '';
                $input['pc'] = $t->payment_number;
                $input['description'] = $t->content;
                $input['op'] = $t->debit_level_2;
                $input['debit'] = '';
                $input['credit'] =  $t->amount;
                $input['sum'] = $previous - $t->amount;
                $input['user'] = $t->pname;
            }
            if($t->debit_level_1 == '111'){
                $input['pc'] = '';
                $input['pt'] = $t->receipt_number;
                $input['description'] = $t->content;
                $input['op'] = $t->credit_level_2;
                $input['debit'] = $t->amount;
                $input['credit'] = '';
                $input['sum'] = $previous + $t->amount;
                $input['user'] = $t->pname;
            }
            
            $result[] = $input;
            // $result = array_merge($result, $input);
            $previous = $input['sum'];
        }
        // print_r($credit - $debit);
        return response()->json($result);
        
        
    }
    // public function fillCenter(){
    //     $transactions = Transaction::whereNotNull('paper_id')->get();
    //     foreach($transactions as $transaction){
    //         if($transaction->paper_id){
    //             $paper = Paper::find($transaction->paper_id);
    //             if($paper){
    //                 $transaction->center_id = $paper->center_id;
    //                 $transaction->save();
    //             }
    //             continue;
    //         }
    //     }
    //     $transactions = Transaction::whereNotNull('class_id')->get();
    //     foreach($transactions as $transaction){
    //         if($transaction->class_id){
    //             $class = Classes::find($transaction->class_id);
    //             if($class){
    //                 $transaction->center_id = $class->center_id;
    //                 $transaction->save();
    //             }
    //             continue;
    //         }
    //     }
       
    // }
}
