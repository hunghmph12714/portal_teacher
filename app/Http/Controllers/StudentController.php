<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Schools;
use App\Parents;
use App\Student;
use App\Classes;
use App\Account;
use App\Transaction;
use App\Center;
use App\Session;
use App\Teacher;
use App\StudentSession;
use App\Tag;
use App\Paper;
use App\TransactionSession;
use Mail;
class StudentController extends Controller
{
    //
    protected function getStudent($id){
        return view('welcome');
    }
    protected function getStudentById(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $student = Student::where('students.id', $request->id)->select('students.id as sid','students.fullname as sname', 'dob', 'school','grade','students.email as semail',
            'students.phone as sphone','gender','parents.id as pid', 'parents.fullname as pname', 'parents.email as pemail', 'parents.alt_fullname as pname2', 'parents.alt_email as pemail2', 'parents.phone as pphone', 'parents.alt_phone as pphone2','parents.note',
            'relationships.id as r_id','relationships.name as r_name','relationships.color'
            )
            ->leftjoin('parents', 'students.parent_id', 'parents.id')
            ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')
            ->first();
        if($student){
            $brothers = Student::where('id', '!=', $student->sid)->where('parent_id', $student->pid)->get();
            return response()->json($student);
        }else{
            return response()->json('Không tìm thấy học sinh', 412);
        }
    }
    protected function saveStudent(Request $request){
        $rules = ['student' => 'required'];
        $this->validate($request, $rules);

        $s = $request->student;
        $student = Student::find($s['sid']);
        if($student){
            $student->fullname = $s['sname'];
            $student->dob = date('Y-m-d', strtotime($s['dob']));
            $student->gender = $s['gender'];
            $student->school = $s['school'];
            $student->grade = $s['grade'];
            $student->email = $s['semail'];
            $student->phone = $s['pphone'];
            $student->save();
        }
        $parent = Parents::find($s['pid']);
        if($parent){
            $parent->fullname = $s['pname'];
            $parent->alt_fullname = $s['pname2'];
            $parent->email = $s['pemail'];
            $parent->phone = $s['pphone'];
            $parent->alt_email = $s['pemail2'];
            $parent->alt_phone = $s['pphone2'];
            $parent->relationship_id = $s['relationship']['value'];
            $parent->note = $s['note'];
            $parent->save();
        }
        return response()->json(200);
    }
    protected function getClass(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $student = Student::find($request->id);
        if($student){
            $classes = $student->activeClasses;
            return response()->json($classes);
        }
    }
    public function findSchools($key){
        $schools = Schools::where('name', 'LIKE', '%'.$key.'%')->limit(10)->get()->toArray();
        return response()->json($schools);
    }
    public function findStudents($key){
        $s = [];
        if(ctype_digit($key)){
            //check parent phone
            $s = Parents::where('parents.phone', 'LIKE', '%'.$key.'%')->select(
                'students.id as sid','students.fullname as s_name','students.fee_email_note','school', 'students.dob as dob','students.grade as grade','students.email as s_email','students.phone as s_phone','students.gender',
                'parents.id as pid', 'parents.fullname as p_name', 'parents.phone as p_phone','parents.email as p_email','parents.note','parents.alt_fullname','parents.alt_email','parents.alt_phone',
                'relationships.id as r_id','relationships.name as r_name','relationships.color'
            )->leftJoin('students','parents.id','students.parent_id')
            ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')
            ->limit(20)->get()->toArray();
            
        }
        else{
            //check student full name
            $s = Student::where('students.fullname', 'LIKE', '%'.$key.'%')->select(
                'students.id as sid','students.fullname as s_name', 'school', 'fee_email_note' ,'students.dob as dob','students.grade as grade','students.email as s_email','students.phone as s_phone','students.gender',
                'parents.id as pid', 'parents.fullname as p_name', 'parents.phone as p_phone','parents.email as p_email','parents.note','parents.alt_fullname','parents.alt_email','parents.alt_phone',
                'relationships.id as r_id','relationships.name as r_name','relationships.color'
            )->leftJoin('parents','students.parent_id','parents.id')
            ->leftJoin('relationships', 'students.relationship_id', 'relationships.id')->orderBy('sid', 'DESC')
            ->limit(20)->get()->toArray();
        }
        foreach($s as $key=>$student){
            $s[$key]['classes'] = Student::find($student['sid'])->classes;
        }
        return response()->json($s);
    }
    protected function getStudents(Request $request){
        $rules = [
            'class_id' => 'required'
        ];
        $this->validate($request, $rules);
        $class_id = $request->class_id;
        $class = Classes::find($class_id);
        $result = [];
        if($class){
            $students = $class->students()->orderBy('status')->get();
            $result = $students->toArray();
            foreach($students as $key=>$student){
                $parent = Parents::where('parents.id',$student->parent_id)
                            ->select('parents.fullname as pname','relationships.name as rname','parents.phone as pphone'
                                ,'parents.email as pemail','parents.alt_fullname','parents.alt_email','parents.alt_phone','parents.note as pnote'
                                ,'relationships.color', 'relationships.id as rid')
                            ->leftJoin('relationships','parents.relationship_id','relationships.id')->first();
                $result[$key]['parent'] = ($parent) ? $parent->toArray() : [];
            }
        }
        return response()->json($result);
    }
    public function validPhone($phone){
        if(preg_match("/[a-z]/i", $phone)){
           return false;
        }
        if(strlen($phone) < 9 || $phone == ""){
            return false;
        }
        else{
            return '0'.explode('/', $phone)[0];
        }
    }
    protected function getFee(Request $request){
        $rules = ['students' => 'required', 'show_all'=>'required'];
        $this->validate($request, $rules);
        $from = ($request->from) ? date('Y-m-01', strtotime($request->from)) : '2010-01-01';
        $to = ($request->to) ? date('Y-m-t 23:59:59', strtotime($request->to)) : '2099-01-01';

        $student_ids = array_column($request->students, 'sid');
        return response()->json($this->generateFee($student_ids, $request->show_all, true, $from, $to));
    }
    protected function generateFee($student_id, $show_all, $show_detail, $from, $to){
        // $student = Student::find($student_id);
        // $classes = $student->classes;
        // print_r($from);
        // print_r($to);
        $acc = Account::where('level_2','131')->first();
        $result = [];
        $id = -1;
        
        $transactions = Transaction::whereIn('student_id', $student_id)->whereBetween('time', [$from ,$to])
                            ->Select(
                                'transactions.id as id','transactions.amount' ,'transactions.time','transactions.paper_id','transactions.content','transactions.created_at',
                                'debit_account.id as debit','debit_account.level_2 as debit_level_2', 'debit_account.name as debit_name', 'debit_account.type as debit_type',
                                'credit_account.id as credit','credit_account.level_2 as credit_level_2', 'credit_account.name as credit_name', 'credit_account.type as credit_type',
                                'students.id as sid', 'students.fullname as sname','students.dob', 
                                'classes.id as cid', 'classes.code as cname', 'sessions.id as ssid', 'sessions.date as session_date ',
                                'users.id as uid','users.name as uname'
                            )
                            ->leftJoin('accounts as debit_account','transactions.debit','debit_account.id')
                            ->leftJoin('accounts as credit_account','transactions.credit','credit_account.id')
                            ->leftJoin('students','transactions.student_id','students.id')
                            ->leftJoin('classes','transactions.class_id','classes.id')
                            ->leftJoin('sessions', 'transactions.session_id','sessions.id')
                            ->leftJoin('users', 'transactions.user', 'users.id')->orderBy('classes.id','DESC')->orderBy('transactions.time', 'ASC')
                            ->get();
        //                     echo "<pre>";
        // print_r($transactions->toArray());
        foreach($transactions as $key => $t){
            $month = Date('m-Y', strtotime($t->time));     
            $detail_amount = TransactionSession::where('transaction_id', $t->id)->get();
            $detail = '';
            setlocale(LC_MONETARY,"vi_VN");
           
            foreach($detail_amount as $key => $da){
                $session = Session::find($da->session_id);
                if($session){
                    $date = date('d/m', strtotime($session->date));
                    $detail = $detail. 'Ngày ' . $date .': '. number_format($da->amount) . " + ";
                }
            }
            if($t->paper_id != NULL){

                $paper = Paper::find($t->paper_id);
                $detail = "PT".$paper->receipt_number."+";
            }
            if(!array_key_exists($month, $result)){
                // echo $month."<br>";
                $result[$month]['amount'] = ($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0);
                $result[$month]['count_transaction'] = 1;
                $result[$month]['id'] = --$id;
                $result[$month]['parent_id'] = '';                    
                $tarray = $t->toArray();
                $tarray['month'] = $month;
                $tarray['parent_id'] = $id;
                $tarray['amount'] = ($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0) ;
                $tarray['time'] = Date('d/m/Y', strtotime($t->time));
                $tarray['detail'] = $detail;
                if($show_detail){
                    array_push($result, $tarray);
                }                
                $result[$month]['time'] = Date('d/m/Y', strtotime($t->time));
                $result[$month]['month'] = $month;
                $result[$month]['content'] = 'Tổng tiền tháng '.$month;
                $result[$month]['detail'] = '';
                $result[$month]['cname'] = '';

            }
            else{
                $result[$month]['amount'] = $result[$month]['amount'] + (($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0));
                $tarray = $t->toArray();
                $tarray['month'] = $month;
                $result[$month]['count_transaction'] ++ ;
                $tarray['amount'] = ($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0) ;
                $tarray['parent_id'] = $result[$month]['id'];
                $tarray['time'] = Date('d/m/Y', strtotime($t->time));
                $tarray['detail'] = $detail;
                $result[$month]['detail'] = '';
                if($show_detail){
                    array_push($result, $tarray);
                }
            }
        }
        $neutral = [];
        if($show_all){
            foreach($result as $r){
                if($r['amount'] == 0){
                    array_push($neutral, $r['id'] );
                }
            }
        }
        $result = array_filter($result, function($v, $k) use ($neutral){
            return (!in_array($v['parent_id'] , $neutral));
        }, ARRAY_FILTER_USE_BOTH);
        //Check số dư kỳ trước
        $remainTransactions = Transaction::whereIn('student_id', $student_id)->where('time', '<' , $from)->get();
        $totalRemain = 0;
        foreach($remainTransactions as $t){
            $totalRemain += (($t->debit == $acc->id) ? $t->amount : (($t->credit == $acc->id) ? -$t->amount : 0));
        }
        $result['remain'] = ['amount' => $totalRemain, 'id' => '-1999', 'detail' => 'Học phí kỳ trước', 'month'=>'','time'=>'','content'=>'Học phí kỳ trước', 'cname' => ''];
        // print_r($result);

        return array_values($result);
    }
    
    protected function normalizeFee(Request $request){
        $rules = ['student_ids' => 'required'];
        $this->validate($request, $rules);

        if(sizeof($request->student_ids) > 1){
            return response()->json(433);
        }else{
            $student_ids = array_column($request->student_ids, 'sid');
            $result = $this->generateFee($student_ids, false, false,'2010-01-01', '2099-01-01');
            $student_id = $student_ids[0];
        }        
        // return response()->json($this->generateFee($student_id, false, false));
        $this->normalize($result, $student_id);
        
        return response()->json('done');

    }
    protected function normalize($result, $student_id){
        $negative_arr = array_filter($result, function($a){
            return ($a['amount'] < 0);
        });
        usort($negative_arr, function($a, $b){
            return $a['amount'] <=> $b['amount'];
        });
        $positive_arr = array_filter($result, function($a){
            return $a['amount'] > 0;
        });
        usort($positive_arr, function($a, $b) {               
            return strtotime(str_replace('/', '-', $a['time'])) - strtotime( str_replace('/', '-', $b['time']));            
        });
        $result = array_merge($negative_arr, $positive_arr);
        // print_r($result);
        //Tags
        $tag = Tag::where('name', 'Chuyển HP')->first();
        if(!$tag){
            $tag = Tag::create(['name' => 'Chuyển HP']);
        }
        // print_r($result);
        $result = array_values(array_filter($result, function($v, $k){
            // return (!in_array($v['parent_id'] , $neutral));
            return ($v['id'] < 0);
        }, ARRAY_FILTER_USE_BOTH));
        foreach($result as $key => &$r){
            if($r['id'] < 0){
                print_r($r);
                if($r['amount'] < 0 && $r['count_transaction'] > 1) {
                    //Tao giao dich can doi 
                    $t['debit'] = Account::where('level_2','131')->first()->id;
                    $t['credit'] = Account::where('level_2', '111')->first()->id;
                    $t['amount'] = -$r['amount'];
                    $t['time'] = date('Y-m-t', strtotime('01-'.$r['month']));
                    $t['student_id'] = $student_id;
                    $t['content'] = 'Chuyển học phí dư có';
                    $t['user'] = auth()->user()->id;
                    $transfer = Transaction::create($t);
                    
                    $transfer->tags()->attach([$tag->id]);
                    $dt['debit'] = Account::where('level_2','111')->first()->id;
                    $dt['credit'] = Account::where('level_2', '131')->first()->id;
                    $dt['amount'] = -$r['amount'];
                    if($key == sizeof($result)-1){
                        $dt['time'] = date('Y-m-d', strtotime("+1 month", strtotime('28-'.$r['month'])));
                        $result[$key]['amount'] = 0;
                    }else{
                        $dt['time'] = date('Y-m-t', strtotime('01-'.$result[$key+1]['month']));
                        $result[$key+1]['amount'] += $r['amount'];
                        $result[$key]['amount'] = 0;
                        $result[$key+1]['count_transaction']++;
                    }
                    $dt['student_id'] = $student_id;
                    $dt['content'] = 'Học phí thừa kì trước';
                    $dt['user'] = auth()->user()->id;
                    $receipt  = Transaction::create($dt);
                    
                    $receipt->tags()->attach([$tag->id]);          
                }
            }
        }
    }
    protected function gatherFee(Request $request){
        $rules = [
            'students' => 'required',
            'center'=>'required',
            'name' => 'required',
            'account' => 'required',
            'total_amount' => 'required',
            'description' => 'required',
        ];
        $this->validate($request, $rules);
              
        $account = Account::find($request->account);
        if($account->level_1 == '111'){
            $p['method'] = 'TM';
            $max_receipt_number = Paper::where('center_id', $request->center)->where('method', 'TM')->max('receipt_number')!="" ? Paper::where('center_id', $request->center)->where('method', 'TM')->max('receipt_number') : 0;
            $p['receipt_number'] = $max_receipt_number + 1;
        }
        if($account->level_1 == '112'){
            $p['method'] = 'NH';
            $max_receipt_number = Paper::where('center_id', $request->center)->where('method', 'NH')->max('receipt_number')!="" ? Paper::where('center_id', $request->center)->where('method', 'NH')->max('receipt_number') : 0;
            $p['receipt_number'] = $max_receipt_number + 1;
        }
        $p['center_id'] = $request->center;
        $p['type'] = 'receipt';
        $p['name'] = $request->name;
        $p['description'] = $request->description;
        $p['amount'] = $request->total_amount;
        $p['user_created_id'] = auth()->user()->id;
        $p['note'] = '';
        $p['created_at'] = date('Y-m-d');
        $p['status'] = NULL;
        $p['address'] = '';
        $p = Paper::create($p);
        $total_amount = $request->total_amount;
        $lastClass = [];
        foreach($request->students as $student){
            $sumOfMonth = array();
            $transactions = $this->generateFee([$student['sid']], false, true,'2010-01-01', '2099-01-01');
            $this->normalize($transactions, $student['sid']);
            foreach($transactions as $key => $v){
                if($v['id'] > 0){
                    $month = $v['month'];
                    $cid = (array_key_exists('cid', $v))?($v['cid'])? $v['cid'] : '-1' :'-1';
                    $sumOfMonth[$month]['total_amount'][] = $v['amount'];
                    if($cid == '-1'){
                        $sumOfMonth[$month]['other_amount'][] = $v['amount'];
                    }else{
                        $sumOfMonth[$month]['class'][$cid]['debit'] = $request->account;
                        $sumOfMonth[$month]['class'][$cid]['credit'] = Account::where('level_2', '131')->first()->id;
                        $sumOfMonth[$month]['class'][$cid]['time'] = date('Y-m-t', strtotime('01-'.$v['month']));
                        $sumOfMonth[$month]['class'][$cid]['content'] = 'Thu học phí '. $v['month'];
                        $sumOfMonth[$month]['class'][$cid]['student_id'] = $student['sid'];
                        $sumOfMonth[$month]['class'][$cid]['class_id'] = (array_key_exists('cid', $v))?$v['cid']:NULL;
                        $sumOfMonth[$month]['class'][$cid]['session_id'] = NULL;
                        $sumOfMonth[$month]['class'][$cid]['user'] = auth()->user()->id;
                        $sumOfMonth[$month]['class'][$cid]['paper_id'] = $p->id;
                        $sumOfMonth[$month]['class'][$cid]['amount'][] = $v['amount'];
                    }
                }
            }
            
            foreach($sumOfMonth as $key => $sum){
                if(array_sum($sum['total_amount']) > 0){
                    $other_fee = array_key_exists('other_amount', $sum) ? array_sum($sum['other_amount']) : 0;
                    foreach($sum['class'] as $cid => $c){
                        $c['amount'] = array_sum($c['amount']) + $other_fee;
                        if($c['amount'] > 0){
                            if($total_amount > 0){
                                if($c['amount'] <= $total_amount){
                                    $total_amount -= $c['amount'];                                
                                }
                                else{
                                    $c['amount'] = $total_amount;
                                    $total_amount = 0;
                                }
                                $lastClass = $c;
                                Transaction::create($c);    
                            }
                            $other_fee = 0;
                        }
                        else{
                            $other_fee = $c['amount'];
                        }
                    }
                }
                        
            }            
        }  
        if($total_amount > 0){
            $lastClass['amount'] = $total_amount;
            Transaction::create($lastClass);    
        }
        return response()->json(200);
        
    }
    public function printFee(Request $request){
        $rules = ['student_id' => 'required', 'from' => 'required', 'to' => 'required'];
        $this->validate($request, $rules);
        $result = [];
        
        $months = [];
        $data = [];
        $student = Student::find($request->student_id);
        $student_name = $student->fullname;
        $sum_amount = 0;
        $content = '';
        $classes = [];
        $max_date = date('Y-m-d');
        $center_id = 0;
        foreach($request->data as $key => $d){
            if($d['id'] < 0 && $d['id'] != -1999) continue;
            $date = date('Y-m-d', strtotime('01-'.$d['month']));
            //Class
            $transaction = Transaction::find($d['id']);
            $tag = Tag::where('name', "Học phí")->first()->id;
            if($d['id'] == -1999){
                $t['content'] = $d['content'];
                $t['sl'] = 1;
                $t['dg'] = $d['amount'];
                $t['session_fee'] = [];
            }else{
                if(!in_array($d['cname'], $classes)){
                    array_push($classes, $d['cname']);
                }
                $t_tag = $transaction->tags()->first();
                $t['content'] = '';
                if($t_tag){
                    if($t_tag->id == $tag){
                        if($t['content'] != ""){
                            $t['content'] = $t['content'].', '.date('m', strtotime('01-'.$d['month']));
                        }
                        else{
                            $t['content'] = 'Học phí tháng '. date('m', strtotime('01-'.$d['month']));
                        }
                    }
                    else{
                        $t['content'] = $d['content'];
                    }
                }
                else{
                    $t['content'] = $d['content'];
                }
                if($d['cname'] == "") $t['content'] = $d['content'];
                $class = Classes::find($transaction->class_id);
                if($class){
                    $center_id = $class->center_id;
                }
                $sessions_count = $transaction->sessions()->count();
                $sessions = $transaction->sessions()->select('sessions.fee')->get()->toArray();
                // echo "<pre>";
                // print_r($sessions);
                $sessions = array_column(array_column($sessions, 'pivot'), 'amount');
                // echo $transaction->id; 
                
                $t['cname'] = ($d['cname'] != '')?$d['cname'] : '-';
                $t['session_fee'] = $sessions;
                $t['sl'] = ($sessions_count != 0) ? $sessions_count : 1;
                $t['dg'] = ($sessions_count != 0) ? $d['amount']/$sessions_count : $d['amount'];
            }
            $t['amount'] = $d['amount'];
            $sum_amount += $d['amount'];
            
            if(!array_key_exists($d['cname'], $data)){
                array_push($months , date('m', strtotime($date)));
                $data[$d['cname']][0] = $t;
            }
            else{
                $check = false;
                foreach($data[$d['cname']] as $cl => $dt){
                    if($dt['dg'] == $t['dg']){
                        $data[$d['cname']][$cl]['content'] = $data[$d['cname']][$cl]['content'] .' , '. date('m', strtotime('01-'.$d['month']));
                        $data[$d['cname']][$cl]['sl'] += $t['sl'];
                        $data[$d['cname']][$cl]['session_fee'] = array_merge($data[$d['cname']][$cl]['session_fee'], $t['session_fee']);
                        $data[$d['cname']][$cl]['amount'] += $t['amount'];
                        $check = true;
                    break;
                    }
                }
                if(!$check){
                    $data[$d['cname']][] = $t;
                }                
            }
        }
        //Content
        $logs = $student->fee_email_note ?  json_decode($student->fee_email_note):new \stdClass();
        $logs->sent_user = auth()->user()->name;
        $logs->sent_time = strtotime(date('d-m-Y H:i:m'));
        $student->fee_email_note = json_encode($logs);
        $student->save();

        $classes = implode(', ', $classes);
        $months = implode(', ', $months);
        $months = date('m', strtotime($request->from)). ' - '. date('m', strtotime($request->to));
        $title = '[VIETELITE] THÔNG BÁO HỌC PHÍ LỚP '.$classes. ' tháng '.$months.' năm học 2020-2021';
        $content = $classes.'_'.$this->vn_to_str($student_name);        
        // print_r($data);d
        $max_date = date('d/m/Y', strtotime(date('Y-m-01', strtotime($request->from)) . ' + 9 days'));
        if(date('Y-m-d',strtotime(str_replace('/','-',$max_date))) < date('Y-m-d')){
            $max_date = date('d/m/Y', strtotime(date('Y-m-d'). '+ 2 days'));
        }
        $result = ['data' => $data, 'title' => $title, 'classes' => $classes,
        'max_date' => $max_date, 'student' => $student_name, 'sum_amount' => $sum_amount, 'content' => $content, 'center_id' => $center_id];
        $center = Center::find($center_id);
        $result['center_address'] = ($center)?$center->address:'';
        $result['center_phone'] = ($center)?$center->phone:'';
        // echo "<pre>";
        // print_r($result);
        foreach($result['data'] as $key => $fees){
            foreach($fees as $c => $fee){
                $result['data'][$key][$c]['session_fee'] = $this->summaryArray($fee['session_fee']);
            }
        }
        return view('fee.a5', compact('result'));
    }
    public function sendEmail(Request $request){
        $rules = ['data' => 'required', 'from'=>'required', 'to'=>'required'];
        $this->validate($request, $rules);
        $result = [];
        $months = [];
        $data = [];
        $student = Student::find($request->student_id);
        $parent_email = Parents::find($student->parent_id)->email;
        $student_name = $student->fullname;
        $sum_amount = 0;
        $content = '';
        $classes = [];
        $max_date = date('Y-m-d');
        $center_id = 0;
        foreach($request->data as $key => $d){
            if($d['id'] < 0 && $d['id'] != '-1999') continue;            
            //Class
            $date = date('Y-m-d', strtotime('01-'.$d['month']));

            if(!in_array($d['cname'], $classes)){
                array_push($classes, $d['cname']);
            }
            $transaction = Transaction::find($d['id']);
            if($d['id'] == -1999){
                if($d['amount'] > 0){
                    $t['content'] = "Học phí thiếu kỳ trước";
                }else{
                    $t['content'] = "Học phí thừa kỳ trước";
                }
                $t['sl'] = 1;
                $t['dg'] = $d['amount'];
                $t['session_fee'] = [];
            }else{
                $class = Classes::find($transaction->class_id);
                if($class){
                    $center_id = $class->center_id;
                }
                $sessions_count = $transaction->sessions()->count();
                $sessions = $transaction->sessions()->select('sessions.fee')->get()->toArray();
                // echo "<pre>";
                // print_r($sessions);
                $t['session_fee'] = array_column(array_column($sessions, 'pivot'), 'amount');
                
                $t['cname'] = $d['cname'];
                $t['content'] = $d['content'];
                $t['sl'] = ($sessions_count != 0) ? $sessions_count : 1;
                $t['dg'] = ($sessions_count != 0) ? $d['amount']/$sessions_count : $d['amount'];
            }
            $t['amount'] = $d['amount'];
            $sum_amount += $d['amount'];
            if(!array_key_exists($d['month'], $data)){
                array_push($months , date('m', strtotime($date)));
                $data[$d['month']][0] = $t;
            }
            else{
                $data[$d['month']][] = $t;
            }
        }
        //aadf
        $logs = $student->fee_email_note ?  json_decode($student->fee_email_note):new \stdClass();
        $logs->sent_user = auth()->user()->name;
        $logs->sent_time = strtotime(date('d-m-Y H:i:m'));
        $student->fee_email_note = json_encode($logs);
        $student->save();

        if($center_id == 3){
            $max_date = date('d/m/Y', strtotime(date('Y-m-01', strtotime($request->from)) . ' + 5 days'));
        }else{
            $max_date = date('d/m/Y', strtotime(date('Y-m-01', strtotime($request->from)) . ' + 9 days'));
        }
        
        
        if(date('Y-m-d',strtotime(str_replace('/','-',$max_date))) < date('Y-m-d')){
            $max_date = date('d/m/Y', strtotime(date('Y-m-d'). '+ 2 days'));
        }
        $classes = implode(',', $classes);
        $months = date('m', strtotime($request->from)). ' - '. date('m', strtotime($request->to));
        $title = '[VIETELITE] THÔNG BÁO HỌC PHÍ LỚP '.$classes. ' tháng '.$months.' năm học 2020-2021';
        $content = $classes.'_'.$this->vn_to_str($student_name);
        
        
        $result = ['data' => $data, 'title' => $title, 'classes' => $classes,
        'max_date' => $max_date, 'student' => $student_name, 'sum_amount' => $sum_amount, 'content' => $content,
         'center_id' => $center_id , 'note' => $request->note, 'months' => $months];
        foreach($result['data'] as $key => $fees){
            foreach($fees as $c => $fee){
                $result['data'][$key][$c]['session_fee'] = $this->summaryArray($fee['session_fee']);
            }
        }
        if($request->preview){
            return view('emails.tbhp', compact('result'));
        }else{
            $result['max_date'] = $request->max_date;
            $d = ['result' => $result];
            $to_email = $parent_email;        
            $to_name = '';
            $mail = 'ketoantrungyen@vietelite.edu.vn';
            $password = 'Mot23457';
            if($center_id == 5){
                $mail = 'ketoantrungyen@vietelite.edu.vn';
                $password = 'Mot23457';
            }
            
            if($center_id == 2 || $center_id == 4){
                $mail = 'ketoancs1@vietelite.edu.vn';
                $password = '12345Bay';
            }
            if($center_id == 3){
                $mail = 'cs.phamtuantai@vietelite.edu.vn';
                $password = 'VeEdu2020';
            }
            $backup = Mail::getSwiftMailer();

            // Setup your outlook mailer
            $transport = new \Swift_SmtpTransport('smtp-mail.outlook.com', 587, 'tls');
            $transport->setUsername($mail);
            $transport->setPassword($password);
            // Any other mailer configuration stuff needed...
            
            $outlook = new \Swift_Mailer($transport);

            // Set the mailer as gmail
            Mail::setSwiftMailer($outlook);
        
            // Send your message
            Mail::send('emails.tbhp',$d, function($message) use ($to_name, $to_email, $result, $mail) {
                $message->to($to_email, $to_name)
                        ->to('webmaster@vietelite.edu.vn')
                        ->subject($result['title'])
                        ->replyTo($mail, 'Phụ huynh hs '.$result['student']);
                $message->from($mail,'VIETELITE EDUCATION CENTER');
            });

            // Restore your original mailer
            Mail::setSwiftMailer($backup);
            return response()->json(200);
            
            try{}
            catch(\Exception $e){
                // Get error here
                return response()->json(418);
            }
        }
        
        // echo "<pre>";
        // print_r($result);
        
        
    }
    protected function summaryArray($arr){
        // [a,a,a,b,c,d,b] => "3*a + 2*b + 1*c + 1*d"   
        $count_array = array_count_values($arr);
        $tmpArr = array();

        foreach($count_array as $key => $val){
            $tmpArr[] = number_format($key)."*".$val;
        }
        $result = implode(' + ', $tmpArr);      
        return $result;
    }
    protected function importStudent(){
        if (($handle = fopen(public_path()."/hs.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $num = count($data);
                $parent_phone = $this->validPhone($data[4]);
                if($parent_phone){
                    //Check parent exist 
                    $p = Parents::where('phone', $parent_phone)->orWhere('alt_phone', '0'.$parent_phone)
                        ->first();
                    if($p){ //Parent existed
                        //Check student exist
                        $dob = ($data[1] == "")? NULL : date('Y-m-d', strtotime(str_replace('/', '-', $data[1]))) ;
                        $s = Student::where('parent_id', $p->id)->where('dob', $dob)->first();
                        if($s){ //student exists 
                            continue;
                        }
                        else{
                            //Create new student
                            $student['parent_id'] = $p->id;
                            $student['fullname'] = $data[0];
                            $student['id'] = $data[9];
                            $student['dob'] = ($data[1] == "")? NULL : date('Y-m-d', strtotime(str_replace('/', '-', $data[1]))) ;
                            $student['school'] = $data[2];
                            $student['relationship_id'] = 1;
                            Student::create($student);
                        }                        
                    }
                    else{
                        //Create new parent
                        $parent['fullname'] = $data[3];
                        $parent['phone'] = $parent_phone;
                        $parent['email'] = $data[5];
                        $parent['alt_fullname'] = $data[6];
                        $parent['alt_email'] = $data[8];
                        $parent['alt_phone'] = $this->validPhone($data[7]);
                        $parent['realtionship_id'] = 1;
                        $p = Parents::create($parent);
                        // echo "<pre>";
                        // print_r($parent);
                        // echo "</pre>";
                        //Create new student       
                        $student['parent_id'] = $p->id;
                        $student['fullname'] = $data[0];
                        $student['id'] = $data[9];
                        $student['dob'] = ($data[1] == "")? NULL : date('Y-m-d', strtotime(str_replace('/', '-', $data[1]))) ;
                        $student['school'] = $data[2];
                        $student['relationship_id'] = 1;
                        Student::create($student);
                        
                    }
                }
            }
            fclose($handle);
        }
    }
    protected function csv(){
        $arr = [];
        $parent = Parents::all();
        $file = fopen(public_path()."/contacts.csv","w");
        foreach($parent as $p){
            $arr = [];
            array_push($arr, $p->fullname);
            array_push($arr, $p->phone);
            array_push($arr, $p->alt_fullname);
            array_push($arr, $p->alt_phone);
            array_push($arr, $p->email);
            $student = Student::where('parent_id', $p->id)->get();
            foreach($student as $s){
                array_push($arr, $s->fullname);
            }
            fputcsv($file, $arr);
        }        
        fclose($file);
    }
    protected function chuanHoa(){
        $students = Student::all();
        foreach($students as $s){
            $checks = Student::where('fullname', $s->fullname)->where('parent_id', $s->parent_id)->where('id', '!=', $s->id)->get();
            foreach($checks as $c){
                $c->forceDelete();
            }
        }
    }
    public function normalPhone(){
        $parents = Parents::all();
        foreach($parents as $p){
            
            if (strpos($p->phone, '(') !== false) {
                
                // $ex = Parents::where('phone', $p->phone)->first();
                // if($ex){
                //     // $ex->forceDelete();
                //     print_r($ex->toArray());
                //     echo "<pre>";
                // }
            }
            $p->phone = str_replace('(', '', str_replace(')','', str_replace('-','', str_replace(' ','', $p->phone))));
            $p->save();
        }
        // $student = Student::all();
        // foreach($student as $s) {
        //     $check_p  = Parents::find($s->parent_id);
        //     if(!$check_p){
        //         $s->parent_id = 0;
        //         $s->save();
        //     }
        // }
    }
    public function testMail(){
        $ids = [1,2];
        $datas = [];
        foreach($ids as $key=>$id){
            $data = [];
            $student_session = StudentSession::find($id);        
            if($student_session){
    
                $data['student'] = Student::find($student_session->student_id);
                $data['parent'] = Parents::find($data['student']->parent_id);
    
                $data['session'] = Session::find($student_session->session_id);
                $data['class'] = Classes::find($data['session']->class_id)->code;
    
                $data['center'] = Center::find($data['session']->center_id);
                $data['teacher'] = Teacher::find($data['session']->teacher_id)->name;
    
                $data['student_session'] = $student_session;
            }
            $datas[$key]  =  $data;
        }
        $d = array('datas'=>$datas);
        return view('emails.thht', compact('datas'));
        // $to_email = $datas[0]['parent']->email;        
        // $to_name = '';
        // Mail::send('emails.thht', $d, function($message) use ($to_name, $to_email, $datas) {
        //     $message->to($to_email, $to_name)
        //             ->subject('[VIETELITE]Tình hình học tập học sinh '. $datas[0]['student']->fullname . ' lớp '. $datas[0]['class']);
        //     $message->from('tranthanhsma@gmail.com','VIETELITE EDUCATION CENTER');
        // });
        // return response()->json();

    }
    function vn_to_str ($str){
 
        $unicode = array(
         
        'a'=>'á|à|ả|ã|ạ|ă|ắ|ặ|ằ|ẳ|ẵ|â|ấ|ầ|ẩ|ẫ|ậ',
         
        'd'=>'đ',
         
        'e'=>'é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ',
         
        'i'=>'í|ì|ỉ|ĩ|ị',
         
        'o'=>'ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ',
         
        'u'=>'ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự',
         
        'y'=>'ý|ỳ|ỷ|ỹ|ỵ',
         
        'A'=>'Á|À|Ả|Ã|Ạ|Ă|Ắ|Ặ|Ằ|Ẳ|Ẵ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ',
         
        'D'=>'Đ',
         
        'E'=>'É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ',
         
        'I'=>'Í|Ì|Ỉ|Ĩ|Ị',
         
        'O'=>'Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ',
         
        'U'=>'Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự',
         
        'Y'=>'Ý|Ỳ|Ỷ|Ỹ|Ỵ',
         
        );
         
        foreach($unicode as $nonUnicode=>$uni){
         
        $str = preg_replace("/($uni)/i", $nonUnicode, $str);
         
        }
        $str = str_replace(' ','_',$str);
         
        return $str;
         
    }
}
