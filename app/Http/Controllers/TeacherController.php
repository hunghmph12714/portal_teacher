<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Teacher;
use App\MinSalary;
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
        $center = Teacher::where('active', 1)->get()->toArray();
        return response()->json($center);
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
        $input['basic_salary_id'] = $this->checkNull($request->base_salary['value']);
        $input['salary_per_hour'] = $this->checkNull($request->salary_per_hour) ;
        $input['percent_salary'] = $this->checkNull($request->salary_percent);
        
        $teacher = Teacher::create($input);

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
        $input['basic_salary_id'] = $this->checkNull($request->base_salary['value']);
        $input['salary_per_hour'] = $this->checkNull($request->salary_per_hour) ;
        $input['percent_salary'] = $this->checkNull($request->salary_percent);
        
        $teacher = Teacher::find($request->id)->update($input);

        return response()->json(Teacher::find($request->id));

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
