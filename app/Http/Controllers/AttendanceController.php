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
use App\StudentSession;
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
            if(!$s->logs){
                $s->logs = [];
            }     
            $result[$s->student_id]['attendance'][] = $s;
            if(sizeof($result[$s->student_id]['attendance']) == 1 ){
                $result[$s->student_id]['student'] = Student::where('students.id',$s->student_id)
                    ->select('students.id as sid','parents.id as pid',
                            'students.fullname as sname', 'dob',
                            'parents.fullname as pname','parents.phone','parents.email','parents.alt_fullname','parents.alt_phone','parents.relationship_id as rid',
                            'relationships.name as rname','relationships.color')
                    ->join('parents', 'students.parent_id','parents.id')
                    ->join('relationships','parents.relationship_id', 'relationships.id')->first();                
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
        print_r($request->attendance);
    }

    public function sendEmail(Request $request){
        $rules = ['student_session_id' => 'required'];
        $this->validate($request, $rules);
        
        
        $ids = $request->student_session_id;
        $datas = [];
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
                
                $data['session'] = Session::find($student_session->session_id);
                $data['class'] = Classes::find($data['session']->class_id)->code;
    
                $data['center'] = Center::find($data['session']->center_id);
                $data['teacher'] = Teacher::find($data['session']->teacher_id)->name;
    
                $data['student_session'] = $student_session;
            }
            $datas[$key]  = $data;
        }
        $d = array('datas'=>$datas);
        // return view('emails.thht', compact('datas'));
        $to_email = $datas[0]['parent']->email;        
        $to_name = '';
        try{
            Mail::send('emails.thht', $d, function($message) use ($to_name, $to_email, $datas) {
                $message->to($to_email, $to_name)
                        ->subject('[VIETELITE]Tình hình học tập học sinh '. $datas[0]['student']->fullname . ' lớp '. $datas[0]['class']);
                $message->from('tranthanhsma@gmail.com','VIETELITE EDUCATION CENTER');
            });
            return response()->json(200);
        }
        catch(\Exception $e){
            // Get error here
            return response()->json(418);
        }
    }
}
