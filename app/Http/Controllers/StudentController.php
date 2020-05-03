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
}
