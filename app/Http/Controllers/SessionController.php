<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Session;
use App\StudentSession;
use App\StudentClass;
use App\Classes;
use App\Account;
use App\Transaction;
use App\Student;
use App\Discount;
use DateTime;
use DateInterval;
use DatePeriod;
class SessionController extends Controller
{
    //
    protected function getLastSession(Request $request){
        $rules = ['class_id' => 'required'];
        $this->validate($request, $rules);
        
        $last_session = Session::where('class_id', $class_id)->orderBy('date','desc')->first();
        if($last_session){
            return response()->json($last_session);
        }
        else{
            return response()->json('Chưa có ca học mới', 412);
        }
    }
    public function generateSessionFromConfig($from, $to, $class_id){
        $from_date = new DateTime($from);
        $to_date = new DateTime($to);
        $interval = DateInterval::createFromDateString('1 day');
        $period = new DatePeriod($from_date, $interval, $to_date);
        $class = Classes::find($class_id);
        $sessions = [];
        if($class){
            $config = \json_decode( $class->config);            
            $sessionsInWeek = array_unique(array_column(array_column($config, 'date'), 'value')); // [0,2,4]
            foreach ($period as $dt) {
                $dayInWeek = $dt->format('N')-1;
                if(in_array($dayInWeek, $sessionsInWeek)){
                    foreach($config as $index => $c){
                        if($dayInWeek == $c->date->value){
                            $from_time = date('H:i:00', $c->from);
                            $to_time = date('H:i:00', $c->to);
                            $input['date'] = $dt->format('Y-m-d');
                            $input['from'] = $dt->format('Y-m-d')." ".$from_time;
                            $input['to'] = $dt->format('Y-m-d')." ".$to_time;
                            $input['teacher_id'] =(is_object($c->teacher))?$c->teacher->value:NULL;
                            $input['center_id'] = $class->center_id;
                            $input['room_id'] = (is_object($c->room))?$c->room->value:NULL;
                            $input['class_id'] = $class_id;
                            $input['ss_number'] = $index;
                            $input['fee'] = $class->fee;
                            $x = Session::create($input);
                            array_push($sessions, $x->toArray());
                        } 
                    }
                }
            }
            // $sessions = Session::insert($sessions);
            return $sessions;
        }
        else return $sessions;
    }
    public function generateAttendances($sessions, $students){
        $student_attendance = [];

        foreach($students as $st){
            $s_a['student'] = $st->toArray();
            $s_a['sessions'] = [];
            foreach($sessions as $s){
                //Với mỗi ca học 
                $ss['session_id'] = $s['id'];
                $sc = StudentClass::where('class_id', $s['class_id'])->where('student_id', $st->id)->first();
                if($sc){
                    $at = $sc->entrance_date;
                    $dt = $sc->drop_time;
                    if($s['date'] > $at){ //
                        if(!$dt || $dt > $s['date']){
                            // echo $dt. ' - '.$s['date'];
                            // echo "<br>";
                            $ss['student_id'] = $st->id;
                            $ss['type'] = 'official';                        
                            StudentSession::create($ss);
                            array_push($s_a['sessions'], $s);
                        }
                        
                    }
                }
            }
            if(sizeof($s_a['sessions']) != 0){
                array_push($student_attendance, $s_a);
            }
        }
        return $student_attendance;

    }
    public function generateTransactions($class_id, $student_attendance){       
        $class = Classes::find($class_id);
        foreach($student_attendance as $sa){
            $fees = [];            
            $fee_per_session = 0;
            foreach($sa['sessions'] as $s){
                $month = date('m-Y', strtotime($s['date']));
                if(!array_key_exists($month, $fees)){
                    $fees[$month]['amount'] = $s['fee'];
                    $fees[$month]['count'] = 1;
                }
                else{
                    $fees[$month]['amount'] += $s['fee'];
                    $fees[$month]['count']++;
                }
                $fee_per_session = $s['fee'];
            }
            foreach($fees as $key => $fee){
                if($fee != 0){
                    $s = Student::find($sa['student']['id']);
                    if($s){
                        $t['debit'] = Account::Where('level_2', '131')->first()->id;
                        $t['credit'] = Account::Where('level_2', '3387')->first()->id;
                        $t['amount'] = $fee['amount'];
                        $t['time'] = Date('Y-m-d', strtotime('1-'.$key));
                        $t['student_id'] = $s->id;
                        $t['class_id'] = $class_id;
                        $t['user'] = auth()->user()->id;
                        $t['content'] = 'Học phí lớp ' .($class ? $class->code : ''). ' tháng '. $key .': '. $fee['count']. ' ca*'.$fee_per_session.'đ';
                        Transaction::create($t);
                        //Check Discount
                        $discounts = Discount::where('student_class_id', $s->pivot['id'])
                                            ->where('status', 'active')
                                            ->where('max_use','>',0)
                                            ->where('expired_at', '>', $t['time'])->get();
                        foreach($discounts as $d){
                            //Check discount available
                            $dt['credit'] = Account::Where('level_2', '131')->first()->id;
                            $dt['debit'] = Account::Where('level_2', '511')->first()->id;
                            $dt['time'] = Date('Y-m-d', strtotime('1-'.$key));
                            $dt['student_id'] = $s->id;
                            $dt['class_id'] = $class_id;
                            $dt['user'] = auth()->user()->id;                                           
                            if($d['percentage']){
                                $dt['amount'] = $fee['amount']/100*intval($d['percentage']);
                                $dt['content'] = 'Miễn giảm học phí '. $key . ' '.$d['percentage'].'%';     
                            }
                            if($d['amount']){
                                $dt['amount'] = intval($d['amount']);
                                $dt['content'] = 'Miễn giảm học phí '. $key . ' '.intval($d['amount']).'đ';     
                                $discount = Discount::find($d['id']);
                                $discount->max_use= $discount->max_use - 1;
                                $discount->save();
                            }
                            Transaction::create($dt);
                        }
                    } 
                }
            }
        }
    }

    protected function getSession(Request $request){
        $rules = [
            'class_id' => 'required',
            'from_date' => 'required',
            'to_date' => 'required',    
        ];
        $this->validate($request, $rules);
        if($request->from_date == '-1' && $request->to_date == '-1'){
            $sessions = Classes::find($request->class_id)->sessions()->
                select('sessions.id as sid','sessions.class_id as cid','sessions.teacher_id as tid','sessions.room_id as rid','sessions.center_id as ctid',
                    'sessions.from','sessions.to','sessions.date','center.name as ctname','room.name as rname','teacher.name as tname','teacher.phone','teacher.email',
                    'sessions.stats','sessions.document','sessions.exercice','sessions.note','sessions.status')->
                leftJoin('teacher','sessions.teacher_id','teacher.id')->
                leftJoin('center','sessions.center_id','center.id')->
                leftJoin('room','sessions.room_id','room.id')->
                get();
            return response()->json($sessions->toArray());
        }
        else{
            return response()->json('?');
        }
    }
    protected function editSession(Request $request){
        $rules = ['class_id' => 'required'];
        $this->validate($request, $rules);
    }
    protected function createSession(Request $request){
       $rules = [
            'class_id' => 'required',
            'from_date' => 'required',
            'to_date' => 'required',  
        ];
        $this->validate($request, $rules);

        $from_date = date('Y-m-d', $request->from_date);
        $to_date = date('Y-m-d', $request->to_date);
        $sessions = $this->generateSessionFromConfig($from_date, $to_date, $request->class_id);
        

        $students = Classes::find($request->class_id)->students;
        $sa = $this->generateAttendances($sessions, $students);
        $this->generateTransactions($request->class_id, $sa);
        return response()->json(count($sessions));
        // return response()->json($sa);
    }
    protected function addSession(Request $request){
        $rules = ['class_id' => 'required', 
            'from_date' => 'required',
            'to_date' => 'required',
            'fee' => 'required'
        ];
        $this->validate($request, $rules);
        $class_id = $request->class_id;
        $input['class_id'] = $request->class_id;
        $input['teacher_id'] = $request->teacher_id;
        $input['center_id'] = $request->center_id;
        $input['room_id'] = $request->room_id;
        $input['status'] = ($request->student_involved && $request->transaction_involved) ? '1' : '0';
        print($input['status']);
        $input['date'] = date('Y-m-d', $request->from_date);
        $input['from'] = date('Y-m-d H:i:00', $request->from_date);
        $input['to'] = date('Y-m-d H:i:00', $request->to_date);
        $input['ss_number'] = 0;
        $input['note'] = $request->note;
        //Create new session
        $session = Session::create($input);

        $document = '';
        //Upload document
        for($i = 0 ; $i < $request->document_count; $i++){
            if($request->has('document'.$i)){
                $ans = $request->file('document'.$i);
                $name = $session->id."_document_".$i."_".time();
                $ans->move(public_path(). "/document/",$name.".".$ans->getClientOriginalExtension());
                $path = "/public/document/".$name.".".$ans->getClientOriginalExtension();
                if($i == 0){
                    $document = $path;
                }else{
                    $document = $document.",".$path;
                } 
            }
        }
        $exercice = '';
        for($i = 0 ; $i < $request->exercice_count ; $i++){
            if($request->has('exercice'.$i)){
                $ans = $request->file('exercice'.$i);
                $name = $session->id."_exercice_".$i."_".time();
                $ans->move(public_path(). "/document/",$name.".".$ans->getClientOriginalExtension());
                $path = "/public/document/".$name.".".$ans->getClientOriginalExtension();
                if($i == 0){
                    $exercice = str_replace(',','',$path);
                }else{
                    $exercice = $document.",". str_replace(',','',$path);
                } 
            }
        }
        $session->document = $document;
        $session->exercice = $exercice;
        $session->save();
        //Add student to session
        if($request->student_involved){
            //Get all active student from class
            $class = Classes::find($class_id);
            if($class){
                $students = $class->activeStudents;
                foreach($students as $student){
                    $s['student_id'] = $student->id;
                    $s['session_id'] = $session->id;
                    $s['attendance'] = 'holding';
                    $s['type'] = 'official';
                    StudentSession::create($s);
                    if($request->transaction_involved){
                        //get account 131
                        $debit = Account::where('level_2', '131')->first();
                        $credit = Account::where('level_2', '3387')->first();
                        $transaction['debit'] = $debit->id;
                        $transaction['credit'] = $credit->id;
                        $transaction['amount'] = intval($request->fee);
                        $transaction['time'] = $session->from;
                        $transaction['content'] = 'Học phí tháng '.date('m', $request->from_date) . ' - Buổi '.date('d/m', $request->from_date);
                        $transaction['student_id'] = $student->id;
                        $transaction['class_id'] = $class_id;
                        $transaction['session_id'] = $session->id;
                        $transaction['user'] = auth()->user()->id;
                        $trans = Transaction::create($transaction);
                    }
                }
            }
        }
        //return response()->json($session);
        // print_r($input);        
    }
    protected function checkDate(Request $request){
        $date = date('Y-m-d', $request->date);
        $session = Session::where('date', $date)->first();
        if($session){
            return response()->json(['result' => false]);
        }
        else{
            return response()->json(['result'=>true]);
        }
    }
   
    protected function deleteSession(Request $request){
        $rules = ['class_id' => 'required'];
        $this->validate($request, $rules);
    }
    protected function applyAdjustment(Request $request){
         $rules = ['discount_id' => 'required'];
         $this->validate($request, $rules);

        $discount = Discount::find($request->discount_id);
        if($discount){
            $session = Session::where('class_id', $discount->class_id)->where('date', '>=', $discount->active_at)->where('date','<=', $discount->expired_at)
                ->get();
            foreach($session as $s){
                $students = $s->students;
                foreach($students as $ss){
                    if($discount->amount < 0){
                        $t['debit'] = Account::Where('level_2', '511')->first()->id;
                        $t['credit'] = Account::Where('level_2', '131')->first()->id;
                        
                    }
                    else{
                        $t['debit'] = Account::Where('level_2', '131')->first()->id;
                        $t['credit'] = Account::Where('level_2', '3387')->first()->id;
                    }
                    $t['amount'] = abs($discount->amount);
                    $t['time'] = Date('Y-m-d', strtotime($s->date));
                    $t['student_id'] = $ss->id;
                    $t['class_id'] = $discount->class_id;
                    $t['user'] = auth()->user()->id;
                    $t['content'] = $discount->content;
                    Transaction::create($t);
                }
            }
            $discount->status = 'expired';
            $discount->save();
            return response()->json();
        }
    }
}
