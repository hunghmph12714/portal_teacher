<?php

namespace App\Http\Controllers;
use App\Entrance;
use App\Student;
use App\Parents;
use Illuminate\Http\Request;

class EntranceController extends Controller
{
    //
    protected function handleCreateEntrance($student_id, $entrance_input){
        // protected $fillable = ['student_id','course_id','center_id','test_time',
        // 'test_answers','test_score','test_note','note','priority','step_id','step_updated_at','status_id'];
    }
    protected function createEntrance(Request $request){
        //Validation
        $rules = [
            'student_name' => 'required',
            'parent_name' => 'required',
            'parent_email' => 'required | email',
            'parent_phone' => 'required',
            'entrance_center' => 'required',
        ];
        $messages = [
            'required' => 'Vui lòng điền đủ các trường (*)'
        ];
        $this->validate($request, $rules, $messages);
        $request = $request->toArray();
        $request['entrance_date'] = date('Y-m-d H:i:m', $request['entrance_date']);
        $request['student_dob'] = date('Y-m-d', $request['student_dob']);
    //Check parent exist
        if($request['parent_name']['__isNew__']){// New parent
            $p = [];
            $p['fullname'] = $request['parent_name']['value'];
            $p['relationship_id'] = $request['selected_relationship']['value'];
            $p['phone'] = $request['parent_phone'];
            $p['email'] = $request['parent_email'];
            $p['note'] = $request['parent_note'];
            $p['alt_fullname'] = $request['parent_alt_name']['value'];
            $p['alt_email'] = $request['parent_alt_email'];
            $p['alt_phone'] = $request['parent_alt_phone'];
            $parent = Parents::create($p);

            if($request['student_name']['__isNew__']){ // New Student
                $s['parent_id'] = $parent->id;
                $s['relationship_id'] = $parent->relationship_id;
                $s['fullname'] = $request['student_name']['value'];
                $s['school'] = $request['student_school']['label'];
                $s['grade'] = $request['student_grade'];
                $s['email'] = $request['student_email'];
                $s['phone'] = $request['student_phone'];
                $s['dob'] = $request['student_dob'];
                $s['gender'] = $request['student_gender'];
                $student = Student::create($s);
            }
            else{

            }
        } 
        else{//Existed parent

        }
        print_r($request);

    }
}
