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
use App\Classes;
use App\Transaction;
use App\Discount;
use App\Account;
use App\Source;
use App\Medium;
use App\Comment;
use Illuminate\Http\Request;

class EntranceController extends Controller
{
    //
    protected function handleCreateEntrance($student_id, $center_id, $course_id, $test_time, $note, $medium_id){
        // protected $fillable = ['student_id','course_id','center_id','test_time',
        // 'test_answers','test_score','test_note','note','priority','step_id','step_updated_at','status_id'];
        $input['student_id'] = $student_id;
        $input['center_id'] = $center_id;
        $input['course_id'] = $course_id;
        $input['test_time'] = $test_time;
        $input['note'] = $note;
        $s = Student::find($student_id);
        $input['priority'] = ($r = Relationship::find($s->relationship_id))? $r->weight : 0;
        
        $init_step = Step::where('type','Quy trình đầu vào')->orderBy('order','asc')->first();
        
        $input['step_id'] = ($init_step->id) ? $init_step->id : null;
        $input['step_updated_at'] = date("Y-m-d H:i:s");

        $init_status = Status::where('type', 'Quy trình đầu vào')->orderBy('id', 'asc')->first();
        $input['status_id'] = ($init_status->id) ? $init_status->id : null;
        //Get medium
        $medium = Medium::find($medium_id);
        if($medium){
            $input['medium_id'] = $medium->id;
            $input['source_id'] = $medium->source_id;
        }
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
        $p['fullname'] = $request['parent_name'];
        $p['relationship_id'] = $request['selected_relationship']['value'];
        $p['phone'] = $request['parent_phone']['label'];
        $p['email'] = $request['parent_email'];
        $p['note'] = $request['parent_note'];
        $p['alt_fullname'] = $request['parent_alt_name'];
        $p['alt_email'] = $request['parent_alt_email'];
        $p['alt_phone'] = $request['parent_alt_phone'];
        $sid = NULL;
        //Check parent exist
        if($request['parent_phone']['__isNew__']){
        // New parent
            $parent = Parents::create($p);

            if($request['student_name']['__isNew__']){ // New Student
            //Create new student
                $student = $this->handleCreateStudent($parent->id, $request);
            //Create Entrance
                $sid = $student->id;
            }
        } 
        else{
        //Existed parent
            //Update parent 
            Parents::find($request['parent_phone']['value'])->update($p);
            if($request['student_name']['__isNew__']){ // New Student
            //Create new student
                $parent_id = $request['parent_phone']['value'];
                $student = $this->handleCreateStudent($parent_id, $request);
            //Create Entrance
                $sid = $student->id;
            }
            else{
                $student_id = $request['student_name']['value'];
                $this->handleUpdateStudent($student_id, $request);
                $sid = $student_id;
            }
        }
        //check mdiu
        $medium_id = (is_array($request['source'])) ? $request['source']['value'] : NULL;
        foreach($request['entrance_courses'] as $entrance_course){                    
            $new_entrance = $this->handleCreateEntrance($sid, $request['entrance_center']['value'], $entrance_course['value'], $request['entrance_date'], $request['entrance_note'], $medium_id);    
        }
        if(sizeof($request['entrance_courses']) == 0){
            $new_entrance = $this->handleCreateEntrance($sid, $request['entrance_center']['value'], NULL, NULL, $request['entrance_note'], $medium_id);
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
    protected function getSource(){
        $sources = Source::where('campaign_id', 1)->get();
        $result = [];
        foreach($sources as $key => $source){
            $mediums = Medium::where('source_id', $source->id)->select('name as label','id as value','source_id')->get();
            $result[] = [
                'label' => $source->name,
                'options' => $mediums->toArray(),
            ];
        }
        return response()->json($result);
    }
    protected function getEntranceByStep($step, $centers){
        $entrances = Entrance::Select(
            'entrances.id as eid','entrances.test_time',DB::raw('DATE_FORMAT(test_time, "%d/%m/%Y %h:%i %p") AS test_time_formated'),'test_answers','test_score','test_note','entrances.note as note','priority','entrances.created_at as created_at',
            'students.id as sid', 'students.fullname as sname',DB::raw('DATE_FORMAT(dob, "%d/%m/%Y") AS dob'),'students.grade','students.email as semail','students.phone as sphone','students.gender','students.school',
            'parents.id as pid', 'parents.fullname as pname', 'parents.phone as phone', 'parents.email as pemail','relationships.name as rname', 'relationships.id as rid',
            'parents.alt_fullname as alt_pname', 'parents.alt_email as alt_pemail', 'parents.alt_phone as alt_phone','parents.note as pnote',
            'relationships.color as color',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),'courses.id as course_id','center.name as center','center.id as center_id','steps.name as step','steps.id as step_id','status.name as status','status.id as status_id',
            'classes.id as class_id', 'classes.name as class', 'enroll_date', 'message', 'step_updated_at', 'attempts'
            ,DB::raw('CONCAT(sources.name," ",mediums.name)  AS source')
        )->where('entrances.step_id', $step)
        ->whereIn('entrances.center_id', $centers)
        ->leftJoin('students','student_id','students.id')->join('parents','students.parent_id','parents.id')
        ->leftJoin('sources', 'source_id', 'sources.id')->leftJoin('mediums', 'medium_id', 'mediums.id')
        ->leftJoin('relationships','parents.relationship_id','relationships.id')
         ->leftJoin('courses','course_id','courses.id')->leftJoin('center','center_id','center.id')
         ->leftJoin('steps','step_id','steps.id')->leftJoin('status','status_id','status.id')
         ->leftJoin('classes','class_id','classes.id')->orderBy('entrances.status_id','asc')
         ->orderBy('priority','desc')->orderBy('created_at','desc')->get();
        return $entrances;
    }
    protected function getEntranceInit(Request $request){
        $rules = ['centers' => 'required']; 
        $this->validate($request, $rules);

        $centers = explode('_', $request->centers);
        // $entrances = Entrance::all();
        return response()->json($this->getEntranceByStep(1, $centers));
        
    }
    protected function getEntranceAppointment(Request $request){
        $rules = ['centers' => 'required']; 
        $this->validate($request, $rules);

        $centers = explode('_', $request->centers);
        return response()->json($this->getEntranceByStep(2, $centers));
    }
    protected function getEntranceResult(Request $request){
        $rules = ['centers' => 'required']; 
        $this->validate($request, $rules);

        $centers = explode('_', $request->centers);
        return response()->json($this->getEntranceByStep(3, $centers));
    }
    protected function getEntranceInform(Request $request){
        $rules = ['centers' => 'required']; 
        $this->validate($request, $rules);

        $centers = explode('_', $request->centers);
        $entrances = $this->getEntranceByStep(4, $centers);
        foreach($entrances as &$e){
            $e['deadline'] = date('d-m-Y',strtotime($e['step_updated_at'] . "+1 days"));
            $e['deadline_formated'] = date('Y-m-d',strtotime($e['step_updated_at'] . "+1 days"));
        }
        return response()->json($entrances);
    }

    protected function editEntrance(Request $request){
        $rules = ['student_id' => 'required', 'entrance_id' => 'required'];
        $this->validate($request, $rules);
        
        // Edit Student and Parent
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
                $student->parent_id = $request->parent_id;
                $student->save();
            }
            //Check parent exist
            if($request->parent_phone['__isNew__']){
                $r = $request->toArray();
                $p = [];
                $p['fullname'] = $r['parent_name'];
                $p['relationship_id'] = $r['selected_relationship']['value'];
                $p['phone'] = $r['parent_phone']['label'];
                $p['email'] = $r['parent_email'];
                $p['note'] = $r['parent_note'];
                $p['alt_fullname'] = $r['parent_alt_name'];
                $p['alt_email'] = $r['parent_alt_email'];
                $p['alt_phone'] = $r['parent_alt_phone'];
                print_r($p);
                $parent = Parents::create($p);
                $student->parent_id = $parent->id;
                $student->save();
            }
        if($request->parent_changed && !$request['parent_phone']['__isNew__']){
            $p = Parents::find($request->parent_id);
            if($p){
                $p->relationship_id = $request->selected_relationship['value'];
                $p->fullname = $request->parent_name;
                $p->phone = $request->parent_phone['label'];
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
                
                $e->note = $request->entrance_note;
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
    }   
    protected function enrollStudent($class_id, $student_id, $entrance_date){
        //Enroll Student to class

        $enroll['student_id'] = $student_id;
        $enroll['class_id'] = $class_id;
        $enroll['entrance_date'] = $entrance_date;
        $sc = StudentClass::create($enroll);
        
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

    protected function setFail1(Request $request){
        $rules = ['id' => 'required', 'type'=> 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if($entrance){
            switch ($request->type) {
                case 'fail1':
                    $entrance->status_id = 4;
                    break;
                case 'lost':
                    $entrance->status_id = 5;
                    break;
                
                case 'fail2':
                    $entrance->status_id = 6;
                    break;
                
                case 'lostKT':
                    $entrance->status_id = 7;
                    break;
                
                case 'fail3':
                    $entrance->status_id = 8;
                    break;
                
                case 'lostKQ':
                    $entrance->status_id = 9;
                    break;
                case 'fail4':
                    $entrance->status_id = 10;
                    break;
                
                case 'lost4':
                    $entrance->status_id = 3;
                    break;
                
                default:
                    # code...
                    break;
            }
            $entrance->save();
        }
        return response()->json('ok');
    }
    protected function initEdit(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if($entrance){
            $entrance->note = $request->note;
            $entrance->status_id = $request->status['value'];
            $entrance->save();
            foreach($request->appointments as $key => $appointment){
                if($appointment['course']){
                    if($key != 0){
                        $entrance = $entrance->replicate();
                    }
                    $entrance->course_id = $appointment['course']['value'];
                    $entrance->test_time = date('Y-m-d H:i:s', strtotime($appointment['date']));
                    $entrance->step_id = 2;
                    $entrance->step_updated_at = date('Y-m-d H:i:s');
                    $entrance->user_created = auth()->user()->id;
                    $entrance->save();
                }else continue;
            }
        }
    }
    protected function createComment(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if($entrance){
            $comment['entrance_id'] = $entrance->id;
            $comment['content'] = $request->note;
            $comment['user_id'] = auth()->user()->id;
            $comment['method'] = $request->method;
            $comment['step_id'] = $entrance->step_id;
            Comment::create($comment);
        }
        return response()->json('ok');
    }
    protected function getMessage(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if($entrance){
            $comments = $entrance->comments()->select('entrance_comments.id as id','users.id as uid', 'users.avatar', 
                'method', 'content', 'users.name','entrance_comments.created_at', DB::raw('DATE_FORMAT(entrance_comments.created_at, "%d-%m-%Y %H:%i") AS created_at_formated') ,'steps.name as sname')
                ->leftJoin('users', 'entrance_comments.user_id', 'users.id')
                ->leftJoin('steps', 'entrance_comments.step_id', 'steps.id')->orderBy('created_at', 'DESC')->get();
            return response()->json($comments->toArray());
        }
    }

    protected function deleteMessage(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $m = Comment::find($request->id);
        if($m){
            $m->forceDelete();
        }
    }

    protected function appointmentEdit(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if($entrance){
            $answers = null;
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
            if($answers){
                $entrance->test_answers = $answers;            
            }
            
            if($request->score){
                $entrance->test_score = $request->score;
                $entrance->test_note = $request->notevalue;

                $entrance->step_id = 4;
                $entrance->step_updated_at = date('Y-m-d H:i:s');
            }else{
                $entrance->step_updated_at = date('Y-m-d H:i:s');
                $entrance->step_id = 3;
            }
            $entrance->save();
        }
    }
    protected function increaseInform(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $entrance = Entrance::find($request->id);
        if($entrance){
            $entrance->attempts++;
            switch ($entrance->attempts) {
                case 1:
                    # code...
                    $entrance->step_updated_at = date('Y-m-d H:i:s');
                    break;
                case 2:
                    # code...
                    $entrance->step_updated_at = date('Y-m-d H:i:s', strtotime('tomorrow'));
                    break;
                case 2:
                    # code...
                    $entrance->step_updated_at = date('Y-m-d H:i:s', strtotime('tomorrow'));
                    break;
                
                default:
                    # code...
                    break;
            }
            $entrance->save();
        }
    }
    
}
