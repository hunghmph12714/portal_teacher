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
                    ->leftJoin('parents', 'students.parent_id','parents.id')
                    ->leftJoin('relationships','parents.relationship_id', 'relationships.id')->first();                
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
        $password = 'Pv$hn$ms26';
        // if($center_id == 5){
        //     $mail = 'ketoantrungyen@vietelite.edu.vn';
        //     $password = 'Mot23457';
        // }
        
        // if($center_id == 2 || $center_id == 4){
        //     $mail = 'ketoancs1@vietelite.edu.vn';
        //     $password = '12345Bay';
        // }
        if($center_id == 3){
            $mail = 'cs.phamtuantai@vietelite.edu.vn';
            $password = 'Mot23457';
        }

        // return view('emails.thht', compact('datas'));
        $to_email = $datas[0]['parent']->email;        
        $to_name = '';
      
            $backup = Mail::getSwiftMailer();

            // Setup your outlook mailer
            $transport = new \Swift_SmtpTransport('smtp-mail.outlook.com', 587, 'tls');
            $transport->setUsername($mail);
            $transport->setPassword($password);
            // Any other mailer configuration stuff needed...
            
            $outlook = new \Swift_Mailer($transport);

            // Set the mailer as gmail
            Mail::setSwiftMailer($outlook);           
            
            if($session_type == "exam"){
                Mail::send('emails.ktdk', $d, function($message) use ($to_name, $to_email, $datas, $mail, $session_month) {
                    $message->to($to_email, $to_name)
                            ->to('webmaster@vietelite.edu.vn')
                            ->subject('[VIETELITE]Kết quả Kiểm tra định kỳ tháng '.$session_month ." của con " . $datas[0]['student']->fullname . ' lớp '. $datas[0]['class'])
                            ->replyTo($datas[0]['center']->email, '[KTDK] Phụ huynh hs '.$datas[0]['student']->fullname);
                    $message->from($mail,'VIETELITE EDUCATION CENTER');
                });
            }
            else{
                Mail::send('emails.thht', $d, function($message) use ($to_name, $to_email, $datas, $mail) {
                    $message->to($to_email, $to_name)
                            ->to('webmaster@vietelite.edu.vn')
                            ->subject('[VIETELITE]Tình hình học tập học sinh '. $datas[0]['student']->fullname . ' lớp '. $datas[0]['class'])
                            ->replyTo($datas[0]['center']->email, 'Phụ huynh hs '.$datas[0]['student']->fullname);
                    $message->from($mail,'VIETELITE EDUCATION CENTER');
                });
            }
            Mail::setSwiftMailer($backup);
            return response()->json(200);
            try{  }
        catch(\Exception $e){
            // Get error here
            return response()->json(418);
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
            $att->save();
        }
        
        }
        return response()->json(200);
    }
}
