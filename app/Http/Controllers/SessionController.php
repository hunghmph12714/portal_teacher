<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Session;
use App\StudentSession;
use App\Classes;
use App\Account;
use App\Transaction;
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
            return response()->json('Không có ca học mới', 412);
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
                            array_push($sessions, $input);
                        } 
                    }
                }
            }
            Session::insert($sessions);
            return $sessions;
        }
        else return $sessions;
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
                    'sessions.stats','sessions.document','sessions.exercice')->
                join('teacher','sessions.teacher_id','teacher.id')->
                join('center','sessions.center_id','center.id')->
                join('room','sessions.room_id','room.id')->
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
            'fee' => 'required'  
        ];
        $this->validate($request, $rules);

        $from_date = date('Y-m-d', $request->from_date);
        $to_date = date('Y-m-d', $request->to_date);
        $sessions = $this->generateSessionFromConfig($from_date, $to_date, $request->class_id);
        return count($sessions);
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
        $input['status'] = '0';

        $input['date'] = date('Y-m-d', $request->from_date);
        $input['from'] = date('Y-m-d H:i:00', $request->from_date);
        $input['to'] = date('Y-m-d H:i:00', $request->to_date);
        $input['ss_number'] = 0;
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
        //Add student to session
        if($request->student_involved){
            //Get all active student from class
            $class = Classes::find($class_id);
            if($class){
                $students = $class->activeStudents;
                foreach($students as $student){
                    $input['student_id'] = $student->id;
                    $input['session_id'] = $session->id;
                    $input['attendance'] = 'holding';
                    $input['type'] = 'official';
                    StudentSession::create($input);

                    if($request->transaction_involved){
                        //get account 131
                        $debit = Account::where('level_2', '131')->first();
                        $credit = Account::where('level_2', '3387')->first();
                        $transaction['debit'] = $debit->id;
                        $transaction['credit'] = $credit->id;
                        $transaction['amount'] = intval($request->fee);
                        $transaction['time'] = $session->from;
                        $transaction['content'] = 'Học phí tháng '.date('m', $request->from_date);
                        $transaction['student_id'] = $student->id;
                        $transaction['class_id'] = $class_id;
                        $transaction['session_id'] = $session->id;
                        $transaction['user'] = auth()->user()->id;
                        $trans = Transaction::create($transaction);
                    }
                }
            }
            
        }
        $session->save();
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
}
