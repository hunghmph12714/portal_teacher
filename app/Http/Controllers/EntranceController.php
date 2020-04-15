<?php

namespace App\Http\Controllers;
use DB;
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
            $p['alt_fullname'] = $request['parent_alt_name'];
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

    protected function getEntrance(Request $request){
        $rules = [
            'center_id' => 'required',
            'course_id' => 'required',
            'step_id' => 'required',
            'user_id' => 'required',
            'student_id' => 'required',
        ];
        $this->validate($request, $rules);

        // Filter by only step
        $step_id = $request->step_id;
        if($step_id == -1){
            //Get all entrance
            $entrances = Entrance::all();
            return response()->json($entrances);
        }
        // $entrances = Entrance::where('step_id', $request->step)

    }
    protected function getEntranceByStep($step){
        if($step == -1){
            $entrances = Entrance::Select(
                'entrances.id as eid',DB::raw('DATE_FORMAT(test_time, "%d/%m/%Y %h:%i %p") AS test_time'),'test_answers','test_score','test_note','entrances.note as enote','priority',
                'entrances.created_at as created_at', 'students.id as sid', 'students.fullname as sname',DB::raw('DATE_FORMAT(dob, "%d/%m/%Y") AS dob'),
                'parents.id as pid', 'parents.fullname as pname', 'parents.phone as phone', 'parents.email as pemail','relationships.name as rname',
                'relationships.color as color',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),'center.name as center','steps.name as step','status.name as status'
            )->join('students','student_id','students.id')->join('parents','students.parent_id','parents.id')->join('relationships','parents.relationship_id','relationships.id')
             ->leftJoin('courses','course_id','courses.id')->join('center','center_id','center.id')
             ->leftJoin('steps','step_id','steps.id')->join('status','status_id','status.id')
             ->orderBy('priority','desc')->get();
            
            
            return response()->json($entrances);
        }
    }
}
