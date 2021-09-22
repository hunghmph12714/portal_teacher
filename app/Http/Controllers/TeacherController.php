<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Teacher;
use App\MinSalary;
use App\TeacherMinSalary;
class TeacherController extends Controller
{
    //
    public function checkNull($v) {
        if($v == "" || is_null($v) || empty($v) || $v == '0'){
            return null;
        }
        else return $v;
    }
    protected function index(){
        $result = [];
        $teachers = Teacher::where('active', 1)->get();
        $i = 0;
        foreach($teachers as $teacher){
            $result[$i] = $teacher;
            $minSalary = $teacher->minSalary;
            $result[$i]['min_salary'] = $minSalary;            
            $i++;
        }
        return response()->json($result);
    }
    protected function create(Request $request){
        $rules = [
            'name' => 'required',
        ];
        $this->validate($request, $rules);
        
        $input['name'] = $request->name;
        $input['email'] = $request->email;
        $input['phone'] = $request->phone;
        $input['domain'] = $request->domain;
        $input['school'] = $request->school;
        $input['personal_tax'] = $this->checkNull($request->tncn);
        $input['insurance'] = $this->checkNull($request->insurance);
        $input['salary_per_hour'] = $this->checkNull($request->salary_per_hour) ;
        $input['percent_salary'] = $this->checkNull($request->salary_percent);
        
        $teacher = Teacher::create($input);
        foreach($request->min_salary as $ms){
            $tms['teacher_id'] = $teacher->id;
            $tms['min_salary_id'] = $ms['value'];
            TeacherMinSalary::create($tms);
        }
        $min_salary = $teacher->minSalary;
        $teacher = $teacher->toArray(); 
        $teacher['min_salary'] = $min_salary;
        return response()->json($teacher);
    }
    protected function edit(Request $request){
        $this->validate($request, ['id'=>'required']);

        // print_r($request->toArray());
        $input['name'] = $request->name;
        $input['email'] = $request->email;
        $input['phone'] = $request->phone;
        $input['domain'] = $request->domain;
        $input['school'] = $request->school;
        $input['personal_tax'] = $this->checkNull($request->tncn);
        $input['insurance'] = $this->checkNull($request->insurance);
        $input['salary_per_hour'] = $this->checkNull($request->salary_per_hour) ;
        $input['percent_salary'] = $this->checkNull($request->salary_percent);
        
        $teacher = Teacher::find($request->id)->update($input);
        $teacher = Teacher::find($request->id);
        $teacher->minSalary()->sync(($request->min_salary)? array_column($request->min_salary, 'value') : []);
        
        $min_salary = $teacher->minSalary;
        $teacher = $teacher->toArray(); 
        $teacher['min_salary'] = $min_salary;
        return response()->json($teacher);

    }
    protected function resign(Request $request){
        $this->validate($request, ['id' => 'required']);

        $teacher = Teacher::find($request->id);
        if($teacher){
            $teacher->active = 0;
            $teacher->save();
            return response()->json(200);
        }
        else return response()->json('Lỗi xảy ra', 422);
    }
//BASIC SALARY
    protected function getBaseSalary(){
        $baseSalary = MinSalary::all();
        return response()->json($baseSalary);
    }
    protected function createBaseSalary(Request $request){
        $rules = [
            'grade' => 'required',
            'level' => 'required',
            'domain' => 'required',
            'salary' => 'required',
        ];
        $message = [
            'required' => 'Vui lòng điền đầy đủ các trường',
        ];
        $this->validate($request, $rules, $message);

        $input = $request->toArray();
        $s = MinSalary::create($input);
        return response()->json($s);
    }
    protected function editBaseSalary(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);
        
        $salary = MinSalary::find($request->id);
        $newData = $request->newData;
        if($salary) {
            $salary->grade = $newData['grade'];
            $salary->level = $newData['level'];
            $salary->domain = $newData['domain'];
            $salary->salary = $newData['salary'];
            $salary->save();
            return response()->json(200);
        }
        return response()->json(422);

    }
    protected function deleteBaseSalary(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $s = MinSalary::find($request->id);
        if($s){
            $s->forceDelete();
        }
        return response()->json(200);
    }
}
