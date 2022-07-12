<?php

namespace App\Http\Controllers;

use App\Care;
use App\CareServive;
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
    public function saveCare($class_id, $student_id, Request $request)
    {
        // dd($request);
        if ($request->method == false || $request->method == 'on') {
            $mt = $request->method1;
        } else {
            $mt = $request->method;
        }

        // dd($mt);/
        $data_care = ['student_id' => $student_id, 'class_id' => $class_id, 'method' => $mt, 'user_id' => Auth::id()];
        $care = Care::create($data_care);

        foreach ($request->cares as $key => $s) {
            $data_service_care = ['care_id' => $care->id, 'sirvice_id' => $key, 'content' => $s];
            $service_care = CareServive::create($data_service_care);
        }
        return back();
    }
    public function list()
    {
        CareServive::all();
    }


    public function editCare($id)
    {
        $care = Care::find($id);
        if ($care) {
            $care->load('student');
            $care->load('service_care');
            return view('cares.edit_care',compact('care'));
        }
    }

    public function saveEditCare($id,Request $request)
    {
        $care = Care::find($id);
        if($care){
            $care->fill($request->all())->save();
            if ($request->method == false || $request->method == 'on') {
                $mt = $request->method1;
            } else {
                $mt = $request->method;
            }
            $care->method=$mt;
            $care->save();
        }
        return back();
    }
}
