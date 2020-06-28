<?php

namespace App\Http\Controllers;
use DB;
use App\Entrance;
use App\Student;
use App\Step;
use App\Relationship;
use App\Status;
use App\Parents;
use App\StudentClass;
use App\Session;
use App\StudentSession;
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
        $input['note'] = date('d-m-Y') . " - ". auth()->user()->name. ": " . $note ."|";
        $s = Student::find($student_id);
        $input['priority'] = ($r = Relationship::find($s->relationship_id))? $r->weight : 0;
        
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
    protected function handleUpdateStudent($student_id, $request){
        // $s['parent_id'] = $parent_id;
        $s['relationship_id'] = $request['selected_relationship']['value'];
        $s['fullname'] = $request['student_name']['label'];
        $s['school'] = $request['student_school']['label'];
        $s['grade'] = $request['student_grade'];
        $s['email'] = $request['student_email'];
        $s['phone'] = $request['student_phone'];
        $s['dob'] = $request['student_dob'];
        $s['gender'] = $request['student_gender'];
        
        return Student::find($student_id)->update($s);
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
            'student_name.required' => 'Vui lòng điền tên học sinh',
            'parent_name.required' => 'Vui lòng điền tên phụ huynh',
            'parent_email.required' => 'Vui lòng điền email phụ huynh',
            'parent_email.email' => 'Email không hợp lệ',
            'parent_phone.required' => 'Vui lòng điền số điện thoại phụ huynh',
            'entrance_center.required' => 'Vui lòng chọn cơ sở đăng ký',
        ];
        $this->validate($request, $rules, $messages);
        $request = $request->toArray();
        $request['entrance_date'] = ($request['entrance_date']) ? date('Y-m-d H:i:m', $request['entrance_date']) : null;
        $request['student_dob'] = ($request['student_dob']) ? date('Y-m-d', $request['student_dob']) : null;
        $p = [];
        $p['fullname'] = $request['parent_name']['label'];
        $p['relationship_id'] = $request['selected_relationship']['value'];
        $p['phone'] = $request['parent_phone'];
        $p['email'] = $request['parent_email'];
        $p['note'] = $request['parent_note'];
        $p['alt_fullname'] = $request['parent_alt_name'];
        $p['alt_email'] = $request['parent_alt_email'];
        $p['alt_phone'] = $request['parent_alt_phone'];

        //Check parent exist
        if($request['parent_name']['__isNew__']){
        // New parent
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
            //Update parent 
            Parents::find($request['parent_name']['value'])->update($p);
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
                $student_id = $request['student_name']['value'];
                $this->handleUpdateStudent($student_id, $request);
                foreach($request['entrance_courses'] as $entrance_course){                    
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
        // $sig = ($step == -1)? '!=' : '=';
        $sig = '=';
        if($step == -1){
            $step = Step::where('type','Quy trình đầu vào')->orderBy('order','asc')->first()->id;
        }
        // $entrances = Entrance::all();
        //     return response()->json($entrances);
        $entrances = Entrance::Select(
            'entrances.id as eid',DB::raw('DATE_FORMAT(test_time, "%d/%m/%Y %h:%i %p") AS test_time'),'test_answers','test_score','test_note','entrances.note as enote','priority','entrances.created_at as created_at',
            'students.id as sid', 'students.fullname as sname',DB::raw('DATE_FORMAT(dob, "%d/%m/%Y") AS dob'),'students.grade','students.email as semail','students.phone as sphone','students.gender','students.school',
            'parents.id as pid', 'parents.fullname as pname', 'parents.phone as phone', 'parents.email as pemail','relationships.name as rname', 'relationships.id as rid',
            'parents.alt_fullname as alt_pname', 'parents.alt_email as alt_pemail', 'parents.alt_phone as alt_phone','parents.note as pnote',
            'relationships.color as color',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),'courses.id as course_id','center.name as center','center.id as center_id','steps.name as step','steps.id as step_id','status.name as status','status.id as status_id',
            'classes.id as class_id', 'classes.name as class', 'enroll_date', 'message'
        )->where('entrances.step_id', $sig, $step)
        ->leftJoin('students','student_id','students.id')->leftJoin('parents','students.parent_id','parents.id')
        ->leftJoin('relationships','parents.relationship_id','relationships.id')
         ->leftJoin('courses','course_id','courses.id')->leftJoin('center','center_id','center.id')
         ->leftJoin('steps','step_id','steps.id')->leftJoin('status','status_id','status.id')
         ->leftJoin('classes','class_id','classes.id')->orderBy('entrances.status_id','asc')
         ->orderBy('priority','desc')->get();
        return response()->json($entrances);
    }
    protected function editEntrance(Request $request){
        $rules = ['student_id' => 'required', 'entrance_id' => 'required', 'parent_id' => 'required'];
        $this->validate($request, $rules);
       
        // Edit Student and Parent
        if($request->student_changed){
            $student = Student::find($request->student_id);
            if($student){
                $student->relationship_id = $request->selected_relationship['value'];
                $student->fullname = $request->student_name['label'];
                $student->school = $request->student_school['label'];
                $student->grade = $request->student_grade;
                $student->email = $request->student_email;
                $student->phone = $request->student_phone;
                $student->dob = ($request->student_dob) ? date('Y-m-d', strtotime($request->student_dob)) : null;
                $student->gender = $request->student_gender;
                $student->save();
            }
        }
        if($request->parent_changed){
            $p = Parent::find($request->parent_id);
            if($p){
                $p->relationship_id = $request->selected_relationship['value'];
                $p->fullname = $request->parent_name['label'];
                $p->phone = $request->parent_phone;
                $p->email = $request->parent_email;
                $p->note = $request->parent_note;
                $p->alt_fullname = $request->parent_alt_name;
                $p->alt_email = $request->parent_alt_email;
                $p->alt_phone = $request->parent_alt_phone;
                $p->save();
            }
        }
        //Edit Entrance
        if($request->entrance_changed){
            $e = Entrance::find($request->entrance_id);
            if($e){
                $e->center_id = $request->entrance_center['value'];
                $e->course_id = $request->entrance_courses['value'];
                $e->test_time = ($request->entrance_date) ? date('Y-m-d H:i:m', strtotime($request->entrance_date)) : null;
                $new_note = explode("|",$request->entrance_note);
                $old_note = explode("|", $e->note);                
                if(count($new_note) >= count($old_note)){
                    $n = date('d-m-Y') . " - ". auth()->user()->name. ": " .$new_note[count($new_note) - 1]. "\r\n|" ;
                    $e->note = $e->note . $n;
                }
                $e->status_id = $request->entrance_status['value'];
                //Check step changed
                if($e->step_id != $request->entrance_step['value']){
                    $e->step_updated_at = date('Y-m-d H:i:s');
                    $e->step_id = $request->entrance_step['value'];
                }
                $e->test_score = $request->test_score;
                $e->test_note = $request->test_note;   
                //Check if student enrolled or not 
                if($e->enroll_date == NULL && $e->class_id == NULL && $request->enroll_date && $request->entrance_classes){
                    $e->enroll_date = date('Y-m-d', strtotime($request->enroll_date));
                    $e->class_id = $request->entrance_classes['value'];
                    $e->save();     
                    //Enroll student to class
                    $this->enrollStudent($e->class_id, $e->student_id, $e->enroll_date);
                }
                else{
                    $e->save();
                }
                       
            }
        } 
        
        // print_r($test->toArray());
    }   
    protected function enrollStudent($class_id, $student_id, $entrance_date){
        //Enroll Student to class

        $enroll['student_id'] = $student_id;
        $enroll['class_id'] = $class_id;
        $enroll['entrance_date'] = $entrance_date;
        $sc = StudentClass::insert($enroll);
        //Enroll Student to session of class

        $sessions = Session::where('class_id', $class_id)->whereDate('date','>=', $entrance_date)->get();
        foreach($sessions as $s){
            $input['student_id'] = $student_id;
            $input['session_id'] = $s->id;
            $input['type'] = 'official';
            StudentSession::insert($input);
        }
        print_r($sessions->toArray());
    }
    protected function uploadTest(Request $request){
        $rules = ['entrance_id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->entrance_id);
        $answers = '';
        if($entrance){
            for($i = 0 ; $i < $request->count; $i++ ){
                if($request->has('image'.$i)){
                    $ans = $request->file('image'.$i);
                    $name = $entrance->id."_answer".$i."_".time();
                    $ans->move(public_path(). "/images/answers/",$name.".".$ans->getClientOriginalExtension());
                    $path = "/public/images/answers/".$name.".".$ans->getClientOriginalExtension();
                    if($i == 0){
                        $answers = $path;
                    }else{
                        $answers = $answers.",".$path;
                    } 
                }
            }
            $entrance->test_answers = $answers;
            $entrance->save();
        }
    }
    protected function deleteEntrance(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id)->forceDelete();
        return response()->json(200);
    }
    protected function sendMessage(Request $request){
        $rules = ['entrance_id' => 'required', 'message' => 'required'];
        $this->validate($request, $rules);
        $entrance = Entrance::find($request->entrance_id);

        $time = strtotime(date('d-m-Y H:i:m'));

        $user = auth()->user()->name;
        if($entrance){
            $r = ($entrance->message)?$entrance->message: [];
            array_push($r, ['time'=> $time , 'user' => $user, 'content' => $request->message]);
            $entrance->message = $r;
            $entrance->save();
            return response()->json($r);
        }
        
    }
}
