<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Teacher;
use App\MinSalary;
class TeacherController extends Controller
{
    //
    protected function index(){
        $center = Teacher::all()->toArray();
        return response()->json($center);
    }

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
