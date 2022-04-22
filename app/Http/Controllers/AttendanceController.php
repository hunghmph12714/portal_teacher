<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Classes;
use App\Student;
use App\Parents;
use App\Session;
use App\Center;
use App\Schools;
use App\Account;
use App\Transaction;
use App\Teacher;
use Mail;
use Swift_SmtpTransport;
use App\StudentSession;
use App\Jobs\SendThht;

class AttendanceController extends Controller
{
    //
    protected function getAttendance(Request $request){
        $rules = ['class_id' => 'required' , 'sessions' => 'required'];
        $this->validate($request, $rules);
        $class_id = $request->class_id;
        $sessions = array_column($request->sessions, 'value');        
        $attendances = StudentSession::whereIn('session_id', $sessions)->get();
        $result = [];
        foreach($attendances as $s){
            $student = Student::where('students.id',$s->student_id)
                ->select('students.id as sid','parents.id as pid',
                        'students.fullname as sname', 'dob',
                        'parents.fullname as pname','parents.phone','parents.email','parents.alt_fullname','parents.alt_phone','parents.relationship_id as rid',
                        'relationships.name as rname','relationships.color')
                ->leftJoin('parents', 'students.parent_id','parents.id')
                ->leftJoin('relationships','parents.relationship_id', 'relationships.id')->first();
            if($student){
                if(!$s->logs){
                    $s->logs = [];
                }     
                $result[$s->student_id]['attendance'][] = $s;
                if(sizeof($result[$s->student_id]['attendance']) == 1 ){
                    $result[$s->student_id]['student'] = $student;
                }
            }
            
        }
        return response()->json(array_values($result));
    }
    protected function editAttendance(Request $request){
        $rules = ['attendance' => 'required'];
        $this->validate($request, $rules);
        foreach($request->attendance as $s){
            foreach($s['attendance'] as $a){
                $sa = StudentSession::find($a['id']);
                if($sa){
                    $sa->attendance = $a['attendance'];
                    $sa->score = $a['score'];
                    $sa->attendance_note = $a['attendance_note'];
                    $sa->max_score = $a['max_score'];
                    $sa->btvn_max = $a['btvn_max'];
                    $sa->btvn_score = $a['btvn_score'];
                    $sa->btvn_complete = $a['btvn_complete'];
                    $sa->comment = $a['comment'];
                    
                    $logs = ($sa->logs)?$sa->logs:[];
                    
                    $time = strtotime(date('d-m-Y H:i:m'));
                    $user = auth()->user()->name;
                    array_push($logs, ['time'=> $time , 'user' => $user]);
                    $sa->logs = $logs;

                    $sa->save();
                }
            }
        }
    }
//send emails
    public function sendEmail(Request $request){
        $rules = ['student_session_id' => 'required'];
        $this->validate($request, $rules);
        
        $ids = $request->student_session_id;
        $datas = [];
        $session_type = 'main';
        $session_month = '';
        $center_id = 0;
        foreach($ids as $key=>$id){
            $data = [];
            $student_session = StudentSession::find($id);     
            $logs = $student_session->logs;
            $logs['sent_user'] = auth()->user()->name;
            $logs['sent_time'] = strtotime(date('d-m-Y H:i:m'));
            $student_session->logs = $logs;
            $student_session->save();
            
            if($student_session){
                $data['student'] = Student::find($student_session->student_id);
                $data['parent'] = Parents::find($data['student']->parent_id);
                
                $session = Session::find($student_session->session_id);
                
                $data['max_score'] = 0;
                $data['min_score'] = 100;
                $data['avg'] = 0;
                $sum = 0;
                if($session->type == 'exam'){
                    $all_students_in_session = $session->students;
                    $COUNT = 0;
                    foreach($all_students_in_session as $student_in_session){
                        $score = explode('/', $student_in_session->pivot['score'])[0];
                        if(!is_numeric($score)){
                            continue;
                        }
                        $COUNT++;
                        $data['max_score'] = ($data['max_score'] > $score) ? $data['max_score'] : $score;
                        $data['min_score'] = ($data['min_score'] < $score) ? $data['min_score'] : $score;
                                                
                        $sum+= is_numeric($score)?$score:0;
                        
                    }
                    if($COUNT != 0){
                        $data['avg'] = round($sum/$COUNT, 1);
                    }
                    
                }
                
                $session_type = $session->type;
                $session_month = date('m', strtotime($session->date));
                $data['session'] = $session;
                
                $data['class'] = Classes::find($data['session']->class_id)->code;
    
                $center = Center::find($data['session']->center_id);
                $center_id = $center->id;
                $data['center'] = $center;
                $data['teacher'] = Teacher::find($data['session']->teacher_id)->name;
                
                
                $data['student_session'] = $student_session;
            }
            $datas[$key]  = $data;
        }
        $d = array('datas'=>$datas);

        $mail = 'info@vietelite.edu.vn';
        $password = "Fol31629";
        if($center_id == 3){
            $mail = 'cs.phamtuantai@vietelite.edu.vn';
            $password = 'Dum33181';
        }
       
        $to_email = filter_var($datas[0]['parent']->email, FILTER_VALIDATE_EMAIL) ? $datas[0]['parent']->email : '';        
        $to_email_2 = filter_var($datas[0]['parent']->alt_email, FILTER_VALIDATE_EMAIL) ? $datas[0]['parent']->alt_email : NULL;     
        $to_name = '';
        try{
            $datas['session_type'] = $session_type;
            $datas['session_month'] = $session_month;
            // print_r($datas);
            SendThht::dispatch($datas, $to_email, $to_name, $mail, $password, $to_email_2);
            
            return response()->json(200);
        }
        catch(\Exception $e){
            // Get error here
            return response()->json(500);
        }
    }
    public function delete(){
        $s = StudentSession::all();
        $i = 0;
        foreach($s as $ss){
            $student = Student::find($ss->student_id);
            $session = Session::find($ss->session_id);
            if(!$student || !$session){
                $ss->forceDelete();
            }
        }
    }
    public function cellEdit(Request $request){
        $rules = ['payload' => 'required'];
        $this->validate($request, $rules);
        foreach($request->payload as $p){
            $att = StudentSession::where('student_id', $p['student_id'])->where('session_id', $p['session_id'])->first();
            if($att){
                if(array_key_exists('value', $p)){
                    $att->{$p['col']} = ($p['value'])?$p['value']:NULL;
                }
                else $att->{$p['col']} = NULL;
                if($p['col'] = "attendance"){
                    
                    if(array_key_exists('value', $p)){
                        switch ($p['value']) {
                            case 'x':
                                $att->attendance = 'present';
                                break;
                            case 'p':
                                $att->attendance = 'absence';
                                break;
                            case 'kp':
                                $att->attendance = 'n_absence';
                                break;
                            case NULL:
                            case '-':
                                $att->attendance = 'holding';
                                break;
                            case 'l':
                                $att->attendance = 'late';
                                break;
                            default:
                                # code...
                                break;
                        }
                    }
                    else{
                        $att->attendance = 'holding';
                    }
                }
            $att->save();
        }
        
        }
        return response()->json(200);
    }
}
