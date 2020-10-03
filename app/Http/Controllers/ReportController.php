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
class ReportController extends Controller
{
    //
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
                    $classes = Classes::where('center_id', 5)->get();
                    break;
                
                case 'tdh':
                    # code...
                    $classes = Classes::where('center_id', 2)->orWhere('center_id', 4)->get();
                    break;
                
                case 'ptt':
                    $classes = Classes::where('center_id', 3)->orWhere('center_id', 4)->get();
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
}
