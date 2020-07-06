<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Classes;
use App\Student;
use App\Parents;
use App\Session;
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
                    $sa->save();
                }
            }
        }
        print_r($request->attendance);
    }
}
