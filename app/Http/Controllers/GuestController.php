<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Schools;
use App\Center;
use App\Course;
use App\Parents;
use App\Student;
use App\Entrance;
use App\Relationship;
use App\Step;
use App\Status;
class GuestController extends Controller
{
    //
    public function formPublic(){
        $schools = Schools::Select('name')->get()->toArray();
        $schools = array_column($schools, 'name');
        $centers = Center::Select('name')->where('name', 'LIKE', '%CS%')->get()->toArray();
        $centers = array_column($centers, 'name');
        // return $schools;
        return view('form-public', compact('schools','centers'));
    }
    public function getCourses(Request $request){
        $courses = Course::select('name','id','grade')->where('grade', $request->grade)->get()->toArray();
        foreach($courses as $key => $c){
            $courses[$key]['name'] = $c['name'] . ' '. $c['grade'];
        }
        return response()->json($courses);
    }
    public function createEntrance($student, $center, $course, $note){
        $e['student_id'] = $student->id;
        $e['center_id'] = $center;
        $e['course_id'] = $course;
        $e['note'] = $note;
        $e['priority'] = Relationship::find($student->relationship_id)->weight;
        $init_step = Step::where('type','Quy trình đầu vào')->orderBy('order','asc')->first();        
        $e['step_id'] = ($init_step->id) ? $init_step->id : null;
        $e['step_updated_at'] = date("Y-m-d H:i:s");

        $init_status = Status::where('type', 'Quy trình đầu vào')->orderBy('id', 'asc')->first();
        $e['status_id'] = ($init_status->id) ? $init_status->id : null;
        
        Entrance::create($e);
    }
    public function handleForm(Request $request){
        $rules = [
            'pname' => 'required|string', 'sname'=>'required|string', 'pphone' => 'required|string', 'pemail'=> 'required|string'
        ];
        $this->validate($request, $rules);

        //chuẩn hóa dữ liệu
        $pphone = str_replace('(','', str_replace(')','', str_replace('-','',$request->pphone)));
        $dob = date('Y-m-d', strtotime(str_replace('/','-', $request->dob)));

        //Check dữ liệu phụ huynh
        $p = Parents::where('phone', $pphone)->orWhere('alt_phone', $pphone)->first();
        if($p){// Phụ huynh đã tồn tại trong csdl
            //Check học sinh
            $s = Student::where('fullname', $request->sname)->where('dob', $dob)->first();
            if($s){//Đã tồn tại học sinh
                //Tạo mới ghi danh
                foreach($request->course as $c){
                    $this->createEntrance($s, $request->center, $c, $request->note);
                }                
            }
            else{
                $student['fullname'] = $request->sname;
                $student['parent_id'] = $p->id;
                $student['dob'] = $dob;
                $student['school'] = $request->school;
                $student['relationship_id'] = $p->relationship_id;
                $student = Student::create($student);
                foreach($request->course as $c){
                    $this->createEntrance($student, $request->center, $c, $request->note);
                } 
            }
        }else{
            $relationship = Relationship::orderBy('weight', 'asc')->first();          
            $parent['fullname'] = $request->pname;
            $parent['phone'] = $pphone;
            $parent['email'] = $request->email;
            $parent['relationship_id'] = $relationship->id;
            $parent = Parents::create($parent);

            $student['fullname'] = $request->sname;
            $student['dob'] = $dob;
            $student['school'] = $request->school;
            $student['parent_id'] = $parent->id;
            $student['relationship_id'] = $relationship->id;
            $student = Student::create($student);

            foreach($request->course as $c){
                $this->createEntrance($student, $request->center, $c, $request->note);
            } 
        }
        return "Cảm ơn quý phụ huynh đã đăng ký, trung tâm sẽ liên hệ trong thời gian sớm nhất";
        // return response()->json($request->toArray());
    }
}
