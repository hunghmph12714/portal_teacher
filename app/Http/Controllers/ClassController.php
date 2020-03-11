<?php

namespace App\Http\Controllers;
use App\Room;
use App\Course;
use Illuminate\Http\Request;

class ClassController extends Controller
{
    // Phòng học
    protected function getRoom(){
        $room = Room::all()->toArray();
        return response()->json($room);
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
    protected function getClass(){

    }
    protected function createClass(Request $request){
        
    }
    protected function editClass(Request $request){

    }
    protected function deleteClass(){

    }
}
