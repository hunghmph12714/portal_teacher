<?php

namespace App\Http\Controllers;
use DB;
use App\Room;
use App\Course;
use App\Classes;
use Carbon\Carbon;
use App\Schools;
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
                        leftJoin('courses','classes.course_id','courses.id')->get()->toArray();
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

    }
    protected function deleteClass(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $room = Classes::find($request->id)->forceDelete();
        return response()->json(200);
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
