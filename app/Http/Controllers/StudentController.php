<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Schools;
use App\Parents;
use App\Student;
use App\Classes;
class StudentController extends Controller
{
    //
    public function findSchools($key){
        $schools = Schools::where('name', 'LIKE', '%'.$key.'%')->limit(10)->get()->toArray();
        return response()->json($schools);
    }
    public function findStudents($key){
        if(ctype_digit($key)){
            //check parent phone
            $s = Parents::where('parents.phone', 'LIKE', '%'.$key.'%')->select(
                'students.id as sid','students.fullname as s_name', 'school', 'students.dob as dob','students.grade as grade','students.email as s_email','students.phone as s_phone','students.gender',
                'parents.id as pid', 'parents.fullname as p_name', 'parents.phone as p_phone','parents.email as p_email','parents.note','parents.alt_fullname','parents.alt_email','parents.alt_phone',
                'relationships.id as r_id','relationships.name as r_name','relationships.color'
            )->leftJoin('students','parents.id','students.parent_id')
            ->leftJoin('relationships', 'parents.relationship_id', 'relationships.id')->limit(10)->get()->toArray();
            return response()->json($s);
        }
        else{
            //check student full name
            $students = Student::where('students.fullname', 'LIKE', '%'.$key.'%')->select(
                'students.id as sid','students.fullname as s_name', 'school', 'students.dob as dob','students.grade as grade','students.email as s_email','students.phone as s_phone','students.gender',
                'parents.id as pid', 'parents.fullname as p_name', 'parents.phone as p_phone','parents.email as p_email','parents.note','parents.alt_fullname','parents.alt_email','parents.alt_phone',
                'relationships.id as r_id','relationships.name as r_name','relationships.color'
            )->leftJoin('parents','students.parent_id','parents.id')
                ->leftJoin('relationships', 'students.relationship_id', 'relationships.id')->limit(10)->get()->toArray();
            return response()->json($students);
        }
    }
    protected function getStudents(Request $request){
        $rules = [
            'class_id' => 'required'
        ];
        $this->validate($request, $rules);
        $class_id = $request->class_id;
        $class = Classes::find($class_id);
        $result = [];
        if($class){
            $students = $class->students;
            $result = $students->toArray();
            foreach($students as $key=>$student){
                $parents = Parents::find($student->parent_id)
                            ->select('parents.fullname as pname','relationships.name as rname','parents.phone'
                                ,'parents.email','parents.alt_fullname','parents.alt_email','parents.alt_phone'
                                ,'relationships.color', 'relationships.id as rid')
                            ->leftJoin('relationships','parents.relationship_id','relationships.id')->first()->toArray();
                $result[$key]['parent'] = $parents;
            }
        }
        return response()->json($result);
    }
    public function validPhone($phone){
        if(preg_match("/[a-z]/i", $phone)){
           return false;
        }
        if(strlen($phone) < 9 || $phone == ""){
            return false;
        }
        else{
            return '0'.explode('/', $phone)[0];
        }
    }

    protected function importStudent(){
        if (($handle = fopen(public_path()."/hs.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 100000000, "|")) !== FALSE) {
                $num = count($data);
               
                $parent_phone = $this->validPhone($data[4]);
                if($parent_phone){
                    //Check parent exist 
                    $p = Parents::where('phone', $parent_phone)->orWhere('alt_phone', '0'.$parent_phone)
                        ->first();
                    if($p){ //Parent existed
                        //Check student exist
                        $dob = ($data[1] == "")? NULL : date('Y-m-d', strtotime(str_replace('/', '-', $data[1]))) ;
                        $s = Student::where('parent_id', $p->id)->where('dob', $dob)->first();
                        if($s){ //student exists 
                            continue;
                        }
                        else{
                            //Create new student
                            $student['parent_id'] = $p->id;
                            $student['fullname'] = $data[0];
                            $student['id'] = $data[9];
                            $student['dob'] = ($data[1] == "")? NULL : date('Y-m-d', strtotime(str_replace('/', '-', $data[1]))) ;
                            $student['school'] = $data[2];
                            $student['relationship_id'] = 1;
                            Student::create($student);
                        }                        
                    }
                    else{
                        //Create new parent
                        $parent['fullname'] = $data[3];
                        $parent['phone'] = $parent_phone;
                        $parent['email'] = $data[5];
                        $parent['alt_fullname'] = $data[6];
                        $parent['alt_email'] = $data[8];
                        $parent['alt_phone'] = $this->validPhone($data[7]);
                        $parent['realtionship_id'] = 1;
                        $p = Parents::create($parent);
                        // echo "<pre>";
                        // print_r($parent);
                        // echo "</pre>";
                        //Create new student       
                        $student['parent_id'] = $p->id;
                        $student['fullname'] = $data[0];
                        $student['id'] = $data[9];
                        $student['dob'] = ($data[1] == "")? NULL : date('Y-m-d', strtotime(str_replace('/', '-', $data[1]))) ;
                        $student['school'] = $data[2];
                        $student['relationship_id'] = 1;
                        Student::create($student);
                        // echo "<pre>";
                        // print_r($student);
                        // echo "</pre>";
                    }
                }
            }
            fclose($handle);
        }
    }
    protected function csv(){
        $arr = [];
        $parent = Parents::all();
        $file = fopen(public_path()."/contacts.csv","w");
        foreach($parent as $p){
            $arr = [];
            array_push($arr, $p->fullname);
            array_push($arr, $p->phone);
            array_push($arr, $p->alt_fullname);
            array_push($arr, $p->alt_phone);
            array_push($arr, $p->email);
            $student = Student::where('parent_id', $p->id)->get();
            foreach($student as $s){
                array_push($arr, $s->fullname);
            }
            fputcsv($file, $arr);
        }        
        fclose($file);
    }
    protected function chuanHoa(){
        $students = Student::all();
        foreach($students as $s){
            $checks = Student::where('fullname', $s->fullname)->where('parent_id', $s->parent_id)->where('id', '!=', $s->id)->get();
            foreach($checks as $c){
                $c->forceDelete();
            }
        }
    }
}
