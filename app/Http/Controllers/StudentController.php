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
        $rules = ['student_id' => 'required', 'show_all'=>'required'];
        $this->validate($request, $rules);

        $student_id = $request->student_id;
        return response()->json($this->generateFee($student_id, $request->show_all, true));
    }
    protected function generateFee($student_id, $show_all, $show_detail){
        $student = Student::find($student_id);
        $classes = $student->classes;
        
        $acc = Account::where('level_2','131')->first();
        $result = [];
        $id = -1;
        
        $transactions = Transaction::where('student_id', $student_id)
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
        // print_r($student_id);
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
        
        return array_values($result);
    }
    protected function normalizeFee(Request $request){
        $rules = ['student_id' => 'required'];
        $this->validate($request, $rules);

        $student_id = $request->student_id;
        $result = $this->generateFee($student_id, false, false);
        // return response()->json($this->generateFee($student_id, false, false));
        
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
        foreach($result as $key => &$r){
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
        return response()->json('done');

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
    public function lnda(){
        $session = Session::where('class_id', '89')->get();
        foreach($session as $s){
            $ss = StudentSession::where('student_id', '3966')->where('session_id', $s->id)->get();
            foreach($ss as $sss){
                $sss->forceDelete();
            }
        }
        
    }
}
