<?php

namespace App\Http\Controllers;
use App\Entrance;
use App\Student;
use App\Step;
use App\Relationship;
use App\Status;
use App\Parents;
use Illuminate\Http\Request;

class EntranceController extends Controller
{
    //
    protected function handleCreateEntrance($student_id, $center_id, $course_id, $test_time, $note){
        // protected $fillable = ['student_id','course_id','center_id','test_time',
        // 'test_answers','test_score','test_note','note','priority','step_id','step_updated_at','status_id'];
        $input['student_id'] = $student_id;
        $input['center_id'] = $center_id;
        $input['course_id'] = $course_id;
        $input['test_time'] = $test_time;
        $input['note'] = $note;
        $input['priority'] = 0;
        
        $init_step = Step::where('type','Quy trình đầu vào')->orderBy('order','asc')->first();
        
        $input['step_id'] = ($init_step->id) ? $init_step->id : null;
        $input['step_updated_at'] = date("Y-m-d H:i:s");

        $init_status = Status::where('type', 'Quy trình đầu vào')->orderBy('id', 'asc')->first();
        $input['status_id'] = ($init_status->id) ? $init_status->id : null;
        $new_entrance = Entrance::create($input);
        return $new_entrance;
    }
    protected function handleCreateStudent($parent_id, $request){
        $s['parent_id'] = $parent_id;
        $s['relationship_id'] = $request['selected_relationship']['value'];
        $s['fullname'] = $request['student_name']['value'];
        $s['school'] = $request['student_school']['label'];
        $s['grade'] = $request['student_grade'];
        $s['email'] = $request['student_email'];
        $s['phone'] = $request['student_phone'];
        $s['dob'] = $request['student_dob'];
        $s['gender'] = $request['student_gender'];
        return Student::create($s);
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
        $request['entrance_date'] = ($request['entrance_date']) ? date('Y-m-d H:i:m', $request['entrance_date']) : null;
        $request['student_dob'] = ($request['student_dob']) ? date('Y-m-d', $request['student_dob']) : null;
        
        //Check parent exist
        if($request['parent_name']['__isNew__']){
        // New parent
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
            //Create new student
                $student = $this->handleCreateStudent($parent->id, $request);
            //Create Entrance
                foreach($request['entrance_courses'] as $entrance_course){
                    $new_entrance = $this->handleCreateEntrance($student->id, $request['entrance_center']['value'], $entrance_course['value'], $request['entrance_date'], $request['entrance_note']);    
                }
            }
        } 
        else{
        //Existed parent
            if($request['student_name']['__isNew__']){ // New Student
            //Create new student
                $parent_id = $request['parent_name']['value'];
                $student = $this->handleCreateStudent($parent_id, $request);
            //Create Entrance
                foreach($request['entrance_courses'] as $entrance_course){
                    $new_entrance = $this->handleCreateEntrance($student->id, $request['entrance_center']['value'], $entrance_course['value'], $request['entrance_date'], $request['entrance_note']);    
                }
            }
            else{
                foreach($request['entrance_courses'] as $entrance_course){
                    $student_id = $request['student_name']['value'];
                    $new_entrance = $this->handleCreateEntrance($student_id, $request['entrance_center']['value'], $entrance_course['value'], $request['entrance_date'], $request['entrance_note']);    
                }
            }
        }


        return response()->json('ok');

    }
}
