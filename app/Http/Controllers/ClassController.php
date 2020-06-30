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
use App\StudentSession;
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
        $courses = Course::all()->toArray();
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
        $p['fullname'] = $request['parent_name']['label'];
        $p['relationship_id'] = $request['selected_relationship']['value'];
        $p['phone'] = $request['parent_phone'];
        $p['email'] = $request['parent_email'];
        $p['note'] = $request['parent_note'];
        $p['alt_fullname'] = $request['parent_alt_name'];
        $p['alt_email'] = $request['parent_alt_email'];
        $p['alt_phone'] = $request['parent_alt_phone'];
        $student_id = NULL;
        //Check parent exist
        if($request['parent_name']['__isNew__']){
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
            Parents::find($request['parent_name']['value'])->update($p);
            if($request['student_name']['__isNew__']){ // New Student
            //Create new student
                $parent_id = $request['parent_name']['value'];
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
                return response()->json('Học sinh đã tồn tại trong lớp', 422);
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
    protected function getClass($center_id, $course_id){
        $center_operator = ($center_id == '-1')? '!=': '=';
        $center_value = ($center_id == '-1')? NULL: $center_id;
        $course_operator = ($course_id == '-1')? '!=': '=';
        $course_value = ($course_id == '-1')? NULL: $course_id;

        $result = Classes::where('center_id', $center_operator, $center_value)->
                        where('course_id', $course_operator, $course_value)->
                        select('classes.id as id','classes.name as name','code',
                        'center.name as center',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
                        'student_number','open_date','classes.active as status',
                        'config','classes.fee as fee')->
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
                        select('classes.id as id','classes.name as name','code',
                        'center.name as center',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
                        'student_number','open_date','classes.active as status',
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
            $class->save();
            $result = Classes::where('classes.id', $class->id)->
                        select('classes.id as id','classes.name as name','code',
                        'center.name as center',DB::raw('CONCAT(courses.name," ",courses.grade)  AS course'),
                        'student_number','open_date','classes.active as status',
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
}
