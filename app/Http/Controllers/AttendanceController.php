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
    protected function getAttendance(){
        $class_id = 1;
        $sessions = [23,24];
        $students = StudentSession::
                            Select('student_session.id as aid','students.id as sid','parents.id as pid',
                                    'attendance','type','score','attendance_note',
                                    'students.fullname as sname', 'dob',
                                    'parents.fullname as pname','parents.phone','parents.email','parents.alt_fullname','parents.alt_phone')
                            ->whereIn('session_id',$sessions)
                            ->join('students', 'student_session.student_id', 'students.id')
                            ->join('parents', 'students.parent_id','parents.id')
                            ->get();
        $attendances = StudentSession::whereIn('session_id', $sessions)->get();
        $result = [];
        foreach($attendances as $s){            
            $result[$s->student_id]['attendance'][] = $s;
            if(sizeof($result[$s->student_id]['attendance']) == 1 ){
                $result[$s->student_id]['student'] = Student::where('students.id',$s->student_id)
                    ->select('students.id as sid','parents.id as pid',
                            'students.fullname as sname', 'dob',
                            'parents.fullname as pname','parents.phone','parents.email','parents.alt_fullname','parents.alt_phone','parents.relationship_id as rid')
                    ->join('parents', 'students.parent_id','parents.id')
                    ->join('relationships','parents.relationship_id', 'relationships.id')->first();                
            }
            
        }
        return response()->json($result);

    }
}
