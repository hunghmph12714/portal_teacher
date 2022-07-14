<?php

namespace App\Http\Controllers;

use App\Care;
use App\CareService;
// use App\CareServive;
use App\Classes;
use App\Service;
// use App\CareServive;
use App\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx\Rels;

class CareController extends Controller
{
    public function addCare($class_id, $student_id)
    {
        $class = Classes::find($class_id);
        $student = Student::find($student_id);
        $services = Service::where('active', 1)->get();
        return view('cares.create', compact('services', 'class', 'student'));
    }
    public function saveCare(Request $request)
    {
        // dd($request);
        $class_id = $request->class_id;
        $student_id = $request->student_id;


        // if ($request->method == false || $request->method == 'on') {
        //     $mt = $request->method1;
        // } else {
        //     $mt = $request->method;
        // }

        $mt = $request->method;

        // dd($mt);/
        $data_care = ['student_id' => $student_id, 'class_id' => $class_id, 'method' => $mt, 'user_id' => Auth::id()];
        $care = Care::create($data_care);

        foreach ($request->cares as $key => $s) {

            $data_service_care = ['care_id' => $care->id, 'service_id' => $s['id'], 'content' => $s['value']];
            CareService::create($data_service_care);
        }
        return back();
    }
    public function list(Request $request)
    {
        $class_id=$request->class_id;
        $care_services =   Care::query()->where('class_id', $class_id)->orderBy('id', 'desc')->get();
        $care_services->load('care_service');
        $care_services->load('student');
        $care_services->load('user');
        $cares = [];
        foreach ($care_services as $c) {
            $care = [];
            $care['student'] = ['id' => $c->student_id, 'name' => $c->student->fullname];
            $care['user'] = ['id' => $c->user_id, 'name' => $c->user->name];
            $care['time']=['created_at'=>$c->created_at,'updated_at'=>$c->created_at];
            array_push($cares,$care);
        }
        return  $cares;
    }


    public function editCare($id)
    {
        $care = Care::find($id);
        if ($care) {
            $care->load('student');
            $care->load('service_care');
            return view('cares.edit_care', compact('care'));
        }
    }

    public function saveEditCare($id, Request $request)
    {
        $care = Care::find($id);
        if ($care) {
            $care->fill($request->all())->save();
            if ($request->method == false || $request->method == 'on') {
                $mt = $request->method1;
            } else {
                $mt = $request->method;
            }
            $care->method = $mt;
            $care->save();
        }
        return back();
    }
}
