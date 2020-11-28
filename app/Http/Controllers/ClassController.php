<?php

namespace App\Http\Controllers;
use DB;
use App\Room;
use App\Session;
use App\Course;
use App\Classes;
use Carbon\Carbon;
use App\Schools;
use App\Student;
use App\Parents;
use App\StudentClass;
use App\Transaction;
use App\Account;
use App\Tag;
use App\StudentSession;
use App\Teacher;
use App\Center;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    // Phòng học
    protected function getRoom(){
        $room = Room::all()->toArray();
        return response()->json($room);
    }
    protected function getRoomCenter($center){
        $rooms = Room::where('center_id', $center)->get()->toArray();
        return response()->json($rooms);
    }
    protected function createRoom(Request $request){
        $rules = ['name' => 'required'];
        $this->validate($request, $rules);

        $input = $request->toArray();
        $room = Room::create($input);
        return response()->json($room);
    }
    protected function editRoom(Request $request){
        $rules = ['id' => 'required', 'newData' => 'required'];
        $this->validate($request, $rules);

        $room = Room::find($request->id);
        $newRoom = $request->newData;
        if($room){
            $room->name = $newRoom['name'];
            $room->center_id = $newRoom['center_id'];
            $room->status = $newRoom['status'];
            $room->save();
            return response()->json(200);
        }
        else{
            return response()->json('Không tìm thấy phòng học', 402);
        }
    }    
    protected function deleteRoom(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $room = Room::find($request->id)->forceDelete();
        return response()->json(200);
    }
    // Khóa học
    protected function getCourse(){
        $courses = Course::orderBy('grade', 'ASC')->orderBy('name','ASC')->get()->toArray();
        return response()->json($courses);
    }
    protected function createCourse(Request $request){
        $rules = ['name' => 'required','grade'=>'required'];
        $this->validate($request, $rules);

        $input = $request->toArray();
        $course = Course::create($input);
        return response()->json($course);
    }
    protected function editCourse(Request $request){
        $rules = ['id'=>'required', 'newData'=>'required'];
        $this->validate($request, $rules);

        $course = Course::find($request->id);
        $newCourse = $request->newData;
        if($course){
            $course->name = $newCourse['name'];
            $course->grade = $newCourse['grade'];
            $course->document = $newCourse['document'];
            $course->fee = $newCourse['fee'];
            $course->class_per_week = $newCourse['class_per_week'];
            $course->session_per_class = $newCourse['session_per_class'];
            $course->save();
            return response()->json(200);
        }
        else{
            return response()->json('Không tìm thấy khóa học', 402);
        }
    }
    protected function deleteCourse(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $room = Course::find($request->id)->forceDelete();
        return response()->json(200);
    }
    // Lớp học
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
    protected function addStudentToClass(Request $request){
        //Validation
        $rules = [
            'student_name' => 'required',
            'parent_name' => 'required',
            'parent_email' => 'required | email',
            'parent_phone' => 'required',
            'status' => 'required',
        ];
        $messages = [
            'student_name.required' => 'Vui lòng điền tên học sinh',
            'parent_name.required' => 'Vui lòng điền tên phụ huynh',
            'parent_email.required' => 'Vui lòng điền email phụ huynh',
            'parent_email.email' => 'Email không hợp lệ',
            'parent_phone.required' => 'Vui lòng điền số điện thoại phụ huynh',
            'status.required' => 'Vui lòng điền trạng thái'
        ];
        $this->validate($request, $rules, $messages);
        $request = $request->toArray();
        $request['student_dob'] = ($request['student_dob']) ? date('Y-m-d', strtotime($request['student_dob'])) : null;
        $p = [];
        $p['fullname'] = $request['parent_name'];
        $p['relationship_id'] = ($request['selected_relationship'] != "") ? $request['selected_relationship']['value'] : null;
        $p['phone'] = $request['parent_phone']['label'];
        $p['email'] = $request['parent_email'];
        $p['note'] = $request['parent_note'];
        $p['alt_fullname'] = $request['parent_alt_name'];
        $p['alt_email'] = $request['parent_alt_email'];
        $p['alt_phone'] = $request['parent_alt_phone'];
        $student_id = NULL;
        //Check parent exist
        if($request['parent_phone']['__isNew__']){
        // New parent
            $parent = Parents::create($p);

            if($request['student_name']['__isNew__']){ // New Student
            //Create new student
                $student = $this->handleCreateStudent($parent->id, $request);
                $student_id = $student->id;
            //Add student to Class
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
                $student_id = $student->id;
            //Add student to Class
                
            //Generate fee   
            }
            else{
                $student_id = $request['student_name']['value'];
                $this->handleUpdateStudent($student_id, $request);
                
                //Add student to Class

                //Generate fee
            }
        }
        if($student_id){
            $checkExisting = StudentClass::where('class_id', $request['class_id'])->where('student_id', $student_id)->first();
            if($checkExisting){
                return response()->json('Học sinh đã tồn tại trong lớp', 418);
            }
            else{
                $sc['student_id'] = $student_id;
                $sc['class_id'] = $request['class_id'];
                $sc['status'] = $request['status'];
                $sc['entrance_date'] = date('Y-m-d', strtotime($request['active_date']));
                            
                $sc = StudentClass::create($sc);
            }
        }
        return response()->json('ok');
    }
    protected function editStudentInClass(Request $request){
        $rules = ['class_id' => 'required', 'student_id'=>'                    '];
        $this->validate($request, $rules);
        //Edit student and parent info
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
                print_r($student->toArray());
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
                $parent = Parents::create($p);
                $student->parent_id = $parent->id;
                $student->save();
            }
        if(!$request->parent_phone['__isNew__']){
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

        //Edit status a
        $sc = StudentClass::where('student_id', $request->student_id)->where('class_id', $request->class_id)->first();
        if($sc){
            $sc->status = $request->status;
            $sc->entrance_date = date('Y-m-d', strtotime($request->active_date));
            
            if($sc->status == 'transfer'){
                if(!$request->transfer_date || !$request->new_active_date || !$request->transfer_class || !array_key_exists('value', $request->transfer_class)){
                    return response()->json('Vui lòng điền đầy đủ *', 442);
                }
                $sc->transfer_date = date('Y-m-d', strtotime($request->transfer_date));
                $sc->drop_time = date('Y-m-d', strtotime($request->transfer_date));
                $stats = ($sc->stats) ? $sc->stats : [];
                $stats['transfer_reason'] = $request->transfer_reason;
                $sc->stats = $stats; 
                //Check exsisting studnet in class 
                $check_sc = StudentClass::where('student_id', $request->student_id)->where('class_id', $request->transfer_class['value'])->first();
                if($check_sc){
                    return response()->json('Học sinh đã tồn tại trong lớp mới', 442);
                }else{
                    $new_sc['student_id'] = $request->student_id;
                    $new_sc['class_id'] = $request->transfer_class['value'];
                    $new_sc['status'] = 'active';
                    $new_sc['entrance_date'] = date('Y-m-d', strtotime($request->new_active_date));                    
                    $new_sc = StudentClass::create($new_sc);
                }
                
            }
            if($request->status == 'droped'){
                $sc->status = $request->status;
                $sc->drop_time = ($request->drop_date)?date('Y-m-d', strtotime($request->drop_date)):date('Y-m-d');
                $stats = ($sc->stats) ? $sc->stats : [];                    
                $stats['drop_reason'] = $request->drop_reason;                  
                $sc->stats = $stats;
            }
            else{
                $sc->drop_time = null;                
            }
            $sc->save();
        }
        
    }
    protected function getClass($center_id, $course_id){
        $center_operator = ($center_id == '-1')? '!=': '=';
        $center_value = ($center_id == '-1')? NULL: $center_id;
        $course_operator = ($course_id == '-1')? '!=': '=';
        $course_value = ($course_id == '-1')? NULL: $course_id;

        $result = Classes::where('center_id', $center_operator, $center_value)->
                        where('course_id', $course_operator, $course_value)->
                        where('classes.type', 'class')->
                        select('classes.id as id','classes.name as name','classes.code as code',
                        'center.name as center',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
                        'student_number','open_date','classes.active as status',
                        'config','classes.fee as fee','online_id','password','droped_number','waiting_number')->
                        leftJoin('center','classes.center_id','center.id')->
                        leftJoin('courses','classes.course_id','courses.id')->get();
        $classes = $result->toArray();
        foreach($result as $key => $class){
            $last_session = $class->sessions->last();            
            if($last_session){
                $classes[$key]['last_session'] = $last_session->date;
            }
            else{
                $classes[$key]['last_session'] = '';
            }
        }
        return response()->json($classes);
    }
    protected function getClassById($class_id){
        $result = Classes::where('classes.id',$class_id)->
                        select('classes.id as id','classes.name as name','classes.code as code',
                        'center.name as center',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
                        'student_number','open_date','classes.active as status',
                        'config','classes.fee as fee')->
                        leftJoin('center','classes.center_id','center.id')->
                        leftJoin('courses','classes.course_id','courses.id')->first();
        return response()->json($result);
    }
    protected function createClass(Request $request){
        $rules = [
            'code' => 'required',
            'name' => 'required',
            'fee' => 'required',
            'center_id' => 'required',
            'course_id' => 'required',
        ];
        $this->validate($request, $rules);
        $request = $request->toArray();
        $request['open_date'] = date('Y-m-d', $request['open_date']);
        $class = Classes::create($request);

        $result = Classes::where('classes.id', $class->id)->
                        select('classes.id as id','classes.name as name','classes.code',
                        'center.name as center',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
                        'student_number','open_date','classes.active as status','online_id','password',
                        'config','classes.fee as fee')->
                        leftJoin('center','classes.center_id','center.id')->
                        leftJoin('courses','classes.course_id','courses.id')->first()->toArray();
        return response()->json($result);
        // echo date("Y-m-d\TH:i:s\Z", $request->open_date/1000);
    }
    protected function editClass(Request $request){
        $rules = [
            'class_id' => 'required',
            'code' => 'required',
            'name' => 'required',
            'fee' => 'required',
            'center_id' => 'required',
            'course_id' => 'required',
        ];
        $this->validate($request, $rules);
        
        $class = Classes::find($request->class_id);
        if($class){
            $class->code = $request->code;
            $class->config = $request->config;
            $class->name = $request->name;
            $class->fee = $request->fee;
            $class->center_id = $request->center_id;
            $class->course_id = $request->course_id;
            $class->open_date = date('Y-m-d', strtotime($request->open_date));
            $class->online_id = $request->online_id;
            $class->password = $request->password;
            $class->save();
            $result = Classes::where('classes.id', $class->id)->
                        select('classes.id as id','classes.name as name','classes.code',
                        'center.name as center',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
                        'student_number','open_date','classes.active as status','online_id','password',
                        'config','classes.fee as fee')->
                        leftJoin('center','classes.center_id','center.id')->
                        leftJoin('courses','classes.course_id','courses.id')->first()->toArray();
            return response()->json($result);
        }
    }
    protected function deleteClass(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $room = Classes::find($request->id)->forceDelete();
        return response()->json(200);
    }
    //Class Detail
    protected function detailClass($class_id){
        return view('welcome');
        // return $class_id;
    }
    protected function detailStudentClass(Request $request){
        $rules = ['student_id' => 'required'];
        $this->validate($request, $rules);
        $student = Student::find($request->student_id);
        if($student){
            $classes = $student->classes;
            return response()->json($classes);
        }
    }
    protected function findClass(Request $request){
        $rules = ['student_id' => 'required'];
        $this->validate($request, $rules);

        $student = Student::find($request->student_id);
        if($student){
            $classes = $student->classes;
            return response()->json($classes);
        }
        // $results = Classes::where('code','LIKE', '%'.$request->key.'%')->get();
        // return response()->json($results);
    }
    //Event
    protected function getClassName(){
        $classes = Classes::select('code','id')->get();
        return response()->json($classes->toArray());
    }
    protected function getEvents(){

        $result = Classes::where('classes.type', 'event')->
                        select('classes.id as id','classes.name as name','classes.code as code',
                        'center.name as center',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
                        'student_number','open_date','classes.active as status',
                        'config','classes.fee as fee','online_id','password','droped_number','waiting_number')->
                        leftJoin('center','classes.center_id','center.id')->
                        leftJoin('courses','classes.course_id','courses.id')->get();
        $classes = $result->toArray();
        // print_r($classes);
        return response()->json($classes);
    }
    protected function createEvent(Request $request){
        $rules = [
            'code' => 'required',
            'name' => 'required',
        ];
        $this->validate($request, $rules);
        $request = $request->toArray();
        $request['open_date'] = date('Y-m-d', strtotime($request['open_date']));
        $resquest['fee'] = 0;
        $request['center_id'] = -1;
        $request['course_id'] = -1;
        $request['type'] = 'event';
        $class = Classes::create($request);

        $result = Classes::where('classes.id', $class->id)->
                        select('classes.id as id','classes.name as name','classes.code',
                        'center.name as center',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
                        'student_number','open_date','classes.active as status','online_id','password',
                        'config','classes.fee as fee')->
                        leftJoin('center','classes.center_id','center.id')->
                        leftJoin('courses','classes.course_id','courses.id')->first()->toArray();
        return response()->json($result);
    }
    protected function editEvent(Request $request){
        $rules = [
            'class_id' => 'required',
            'code' => 'required',
            'name' => 'required',
        ];
        $this->validate($request, $rules);
        
        $class = Classes::find($request->class_id);
        if($class){
            $class->code = $request->code;
            $class->name = $request->name;
            $class->open_date = date('Y-m-d', strtotime($request->open_date));
            $class->save();
            $result = Classes::where('classes.id', $class->id)->
                        select('classes.id as id','classes.name as name','classes.code',
                        'center.name as center',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
                        'student_number','open_date','classes.active as status','online_id','password',
                        'config','classes.fee as fee')->
                        leftJoin('center','classes.center_id','center.id')->
                        leftJoin('courses','classes.course_id','courses.id')->first()->toArray();
            return response()->json($result);
        }
    }
    //HELPER
    public function importDB(){
        $row = 1;
        $mg = [];
        if (($handle = fopen(public_path()."/css/maugiao.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $num = count($data);
                for ($c=0; $c < $num; $c++) {
                    $input = ['type' => 'MG', 'name' => $data[$c]];
                    $checkSchool = Schools::where('name', $data[$c])->first();
                    if(!$checkSchool){
                        array_push($mg, $input);
                    }  
                    else{
                        echo "aa". "<br>";
                    }                  
                }
            }
            fclose($handle);
        }
        $mg = Schools::insert($mg);
        $mg = [];
        if (($handle = fopen(public_path()."/css/tieuhoc.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $num = count($data);
                for ($c=0; $c < $num; $c++) {
                    $input = ['type' => 'TH', 'name' => $data[$c]];
                    $checkSchool = Schools::where('name', $data[$c])->first();
                    if(!$checkSchool){
                        array_push($mg, $input);
                    }                    
                }
            }
            fclose($handle);
        }
        $mg = Schools::insert($mg);
        $mg = [];
        if (($handle = fopen(public_path()."/css/thcs.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $num = count($data);
                for ($c=0; $c < $num; $c++) {
                    $input = ['type' => 'THCS', 'name' => $data[$c]];
                    $checkSchool = Schools::where('name', $data[$c])->first();
                    if(!$checkSchool){
                        array_push($mg, $input);
                    }                    
                }
            }
            fclose($handle);
        }
        $mg = Schools::insert($mg);
        $mg = [];
        if (($handle = fopen(public_path()."/css/thpt.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $num = count($data);
                for ($c=0; $c < $num; $c++) {
                    $input = ['type' => 'THPT', 'name' => $data[$c]];
                    $checkSchool = Schools::where('name', $data[$c])->first();
                    if(!$checkSchool){
                        array_push($mg, $input);
                    }                    
                }
            }
            fclose($handle);
        }
        $mg = Schools::insert($mg);
        
        
        
    }
    public function getSchool(){
        $schools = Schools::all()->toArray();
        echo "<pre>";
        print_r($schools);
        echo "<pre>";
    }
    public function listStudent(){
        $classes = Classes::where('student_number', '>' , 0)->get();
        $fp = fopen('file.csv', 'w');
        foreach($classes as $c){
            $students = $c->students;
            foreach($students as $s){
                $parent = Parents::find($s->parent_id);
                if($parent){
                    $result = [$c->code, $s->fullname, $s->dob, $parent->email, $parent->phone, $parent->fullname, $s->detail['status']];
                    fputcsv($fp, $result);
                }                
            }
        }
    }
    public function listTeacher(){
        $classes = Classes::where('student_number', '>' , 0)->get();
        $fp = fopen('teachers.csv', 'w');
        foreach($classes as $c){
            // $students = $c->students;
            // foreach($students as $s){
            //     $parent = Parents::find($s->parent_id);
            //     if($parent){
            //         $result = [$c->code, $s->fullname, $s->dob, $parent->email, $parent->phone, $parent->fullname, $s->detail['status']];
            //         fputcsv($fp, $result);
            //     }                
            // }
            if(is_array($c->config)){
                foreach($c->config as $cc){
                    $teacher_id = is_array($cc['teacher']) ? $cc['teacher']['value'] : 0;
                    $teacher = Teacher::find($teacher_id);
                    $tname = ($teacher) ? $teacher->name : '';
                    $temail = ($teacher) ? $teacher->email : '';
                    $tphone = ($teacher) ? $teacher->phone : '';
                    
                    $date = (is_array($cc['date']) && array_key_exists('label',$cc['date'])) ? $cc['date']['label'] : 0;
                    $center = Center::find($c->center_id);
                    $center = ($center) ? $center->name : '';
                    $result = [$c->id, $c->code, $center , $date , $c->fee, $c->student_number, $c->droped_number, $c->waiting_number,$teacher_id, $tname, $temail, $tphone];
                    fputcsv($fp, $result);
                }
            }
        }
    }
    protected function getReport(Request $request){
        $rules = ['class_id' => 'required', 'from' => 'required', 'to' => 'required'];
        $this->validate($request, $rules);

        $from = date('Y-m-d 00:00:00', strtotime($request->from));
        $to = date('Y-m-d 23:59:59', strtotime($request->to));
        $class_id = $request->class_id;
        $class = Classes::find($class_id);
        $sessions = Session::whereBetween('date',[$from, $to])->where('class_id', $class_id)->get();
        $result = [];
        if($class){  
            //session            
            $students = $class->students;
            foreach($students as $s){
                $parent = Parents::find($s->parent_id);
                if(!$parent){
                    continue;
                }
                $r['fullname'] = $s->fullname;
                $r['pname'] = $parent->fullname;
                $r['dob'] = date('d-m-Y', strtotime($s->dob));
                $r['phone'] = $parent->phone; $r['email'] = $parent->email; 
                $r['id'] = $s->id;
                $r['status'] = $s->detail['status'];
                $r['entrance'] = $s->detail['entrance_date'];
                $r['drop'] = $s->detail['drop_time'];
                $transactions = Transaction::where('class_id', $class_id)->where('student_id', $s->id)->whereBetween('time',[$from, $to])->get();
                $r['hp'] = 0;
                $r['mg'] = 0;
                $r['dd'] = 0;
                $r['no'] = 0;
                $r['gc'] = 0;
                $r['cd'] = 0;
                $r['remain'] = 0;
                foreach($transactions as $t){
                    //hp 
                    $acc_no = Account::where('level_2', '131')->first()->id;
                    $dtcth = Account::where('level_2','3387')->first()->id;
                    $dt = Account::where('level_2', '511')->first()->id;
                    
                    // print_r($t->debit);
                    // Học phí
                    $tag = $t->tags()->first();
                    
                    if($t->debit == $acc_no){
                        $r['hp'] += $t->amount;
                    }
                    // Điều chỉnh học phí
                    if(($t->debit == $dtcth) && $t->credit == $acc_no){
                        $r['hp'] -= $t->amount;
                    }
                    // Miễn giảm
                    if(($t->debit == $dt) && $t->credit == $acc_no ){
                        $r['mg'] += $t->amount;
                    }
                    //DD
                    $acc = Account::where('type','equity')->get('id')->toArray();
                    
                    if(in_array($t->debit, array_column($acc, 'id')) && $t->credit == $acc_no){
                        $r['dd'] += $t->amount;
                    }
                    //giữ chỗ
                    // $tag = Tag::where('name', 'Giữ chỗ')->first()->id;
                    // $t_tag = $t->tags->toArray();
                    // if($t_tag){
                    //     foreach($t_tag as $tt){
                    //         if($tt['id'] == $tag){
                    //             $r['gc'] += $t->amount;
                    //         }
                    //     }
                    // }

                    //Số dư kì trước
                    $debit = Transaction::where('class_id', $class_id)->where('student_id', $s->id)->where('time', '<', $from)->where('debit', $acc_no)->sum('amount');
                    $credit = Transaction::where('class_id', $class_id)->where('student_id', $s->id)->where('time', '<', $from)->where('credit', $acc_no)->sum('amount');
                    $r['remain'] = $debit - $credit;
                }
                $r['attendance'] = [];
                $r['cd'] = $r['hp'] - $r['mg'] + $r['remain'];
                $r['no'] = $r['cd'] - $r['dd'];

                //Attendance
                foreach($sessions as $ss){
                    $attendance = StudentSession::where('session_id', $ss->id)->where('student_id', $s->id)->first();
                    if($attendance){
                        switch ($attendance->attendance) {
                            case 'present':
                                # code...
                                $r['attendance'][] = 'x';
                                break;                            
                            case 'late':
                                # code...
                                $r['attendance'][] = 'x';
                                break;                            
                            case 'absence':
                                # code...
                                $r['attendance'][] = 'p';
                                break;                            
                            case 'n_absence':
                                # code...
                                $r['attendance'][] = 'kp';
                                break;                            
                            case 'holding':
                                # code...
                                $r['attendance'][] = '-';
                                break;                            
                            default:
                                # code...
                                break;
                        }                        
                    }
                    else{
                        $r['attendance'][] = '-';
                    }
                }
                $result[] = $r;
            }
        }
        return response()->json(['students' => $result , 'sessions'=>$sessions->toArray()]);
    }
    protected function getScoreReport(Request $request){
        $rules = ['class_id' => 'required'];
        $this->validate($request, $rules);
        $class_id = $request->class_id;
        $from = date('Y-m-d 00:00:00', strtotime($request->from));
        $to = date('Y-m-d 23:59:59', strtotime($request->to));
        $class = Classes::find($class_id);
        $sessions = Session::Select('sessions.id','teacher.name','sessions.date')->
            whereBetween('date',[$from, $to])->where('class_id', $class_id)->join('teacher', 'sessions.teacher_id', 'teacher.id')->orderBy('sessions.date')->get();
        $result = [];
        if($class){            
            $students = $class->students;
            foreach($students as $s){
                $parent = Parents::find($s->parent_id);
                if(!$parent){
                    continue;
                }
                $r['fullname'] = $s->fullname;
                $r['pname'] = $parent->fullname;
                $r['dob'] = date('d-m-Y', strtotime($s->dob));
                $r['phone'] = $parent->phone; $r['email'] = $parent->email; 

                $r['attendance'] = [];
                $r['score'] = [];
                $r['id'] = $s->id;
                $r['status'] = $s->detail['status'];
                //Attendance
                foreach($sessions as $ss){
                    // $attendance = StudentSession::where('session_id', $ss->id)->where('student_id', $s->id)->first();
                    $attendance = $ss->student($s->id)->first()['pivot'];
                    // print_r($attendance->toArray());
                    if($attendance){
                        switch ($attendance->attendance) {
                            case 'present':
                                # code...
                                $r['attendance'][] = 'x';
                                break;                            
                            case 'late':
                                # code...
                                $r['attendance'][] = 'x';
                                break;                            
                            case 'absence':
                                # code...
                                $r['attendance'][] = 'p';
                                break;                            
                            case 'n_absence':
                                # code...
                                $r['attendance'][] = 'kp';
                                break;                            
                            case 'holding':
                                # code...
                                $r['attendance'][] = '-';
                                break;                            
                            default:
                                # code...
                                break;
                        }
                        $r['score']['btvn_max'][] = $attendance->btvn_max;
                        $r['score']['btvn_complete'][]  = $attendance->btvn_complete;
                        $r['score']['btvn_score'][]  = $attendance->btvn_score;
                        $r['score']['max_score'][]  = $attendance->max_score;
                        $r['score']['score'][]  = $attendance->score;
                        $r['score']['comment'][] = $attendance->comment;
                        $r['score']['btvn_comment'][] = $attendance->btvn_comment;
                    }
                    else
                    {
                        $r['attendance'][] = '';
                        $r['score']['btvn_max'][] = '';
                        $r['score']['btvn_complete'][]  ='';
                        $r['score']['btvn_score'][]  = '';
                        $r['score']['max_score'][]  ='';
                        $r['score']['score'][]  ='';
                        $r['score']['comment'][] = '';
                        $r['score']['btvn_comment'][] = '';

                    }
                }
                $result[] = $r;
            }
        }
        return response()->json(['students' => $result , 'sessions'=>$sessions->toArray()]);
    }
    protected function reGenerateFee(){
        $classes = Classes::where('student_number', '>', 0)->get();
        foreach($classes as $c){
            // $sessions = Session::where('class_id', $c->id)->whereBetween()
            $students = $c->students;
            foreach($students as $s){
                
                $entrance_date = strtotime($s->detail['entrance_date']);
                $first_date = strtotime('01-08-2020');
                $from = date('Y-m-d', ($entrance_date > $first_date) ? $entrance_date : $first_date);
                $to = date('Y-m-d', strtotime('30-09-2020'));

                $sessions = Session::where('class_id', $c->id)->whereBetween('date', [$from, $to])->get();
                foreach($sessions as $ss){
                    if($ss->fee == 0){
                        echo $c->code;
                        echo "<pre>";
                        print_r($ss->toArray());
                        echo "<pre>";
                    }
                }
                // print_r($sessions->toArray());
                // echo "<pre>";

            }
        }
    }
    protected function getActiveStudent(Request $request){
        $rules = ['class_id' => 'required'];
        $this->validate($request, $rules);
        $class = Classes::find($request->class_id);
        if($request->has('session_date')){
            $date = date('Y-m-d', strtotime($request->session_date));            
            $students = $class->activeStudentsDate($date)->get(); 
        }
        else{
            $students = $class->activeStudents;
        }
        return response()->json($students);
        
    }
    protected function getEventInfo(){
        $events = Classes::where('type', 'event')->where('active', 1)->get();
        $result = [];
        foreach($events as $event){
            $products = Session::where('class_id', $event->id)->get();
            $result[] = $event;
        }
        return response()->json($result);
    }
    protected function getLocationInfo(){
        $events = Classes::where('type', 'event')->where('active', 1)->get();
        $result = [];
        foreach($events as $event){
            $rooms = Session::where('class_id', $event->id)->select('room_id', 'room.name')->leftJoin('room', 'sessions.room_id', 'room.id')->distinct('room_id')->get();
            foreach($rooms as $r){
                if(!in_array(['id'=> $r->room_id, 'label'=> $r->name ], $result)){
                    $result[] = ['id'=> $r->room_id, 'label'=> $r->name ];
                }
                
            }
        }
        return response()->json($result);
    }
    // protected function fuckDrop(){
    //     // $sc = StudentClass::where('status', 'active')->whereNotNull('drop_time')->get();
    //     $sc = StudentClass::where('drop_time', '1970-01-01')->get();
    //     foreach($sc as $a){
    //         $a->drop_time = $a->entrance_date;
    //         $a->save();
    //     }
    //     echo "<pre>";
    //     print_r($sc->toArray());
    // }
    // protected function duplicate(){
    //     $sc = StudentClass::all();
    //     foreach($sc as $s){
    //         $check = StudentClass::where('student_id', $s->student_id)->where('class_id', $s->class_id)->where('id', '!=', $s->id)->first();
    //         if($check){
    //             echo "<pre>";
    //             print_r($check->toArray());
    //         }
    //     }
    // }
    
}
