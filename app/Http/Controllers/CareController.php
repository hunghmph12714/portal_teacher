<?php

namespace App\Http\Controllers;

use App\Care;
use App\CareService;
// use App\CareServive;
use App\Classes;
use App\Exports\CareExport;
use App\Service;
// use App\CareServive;
use App\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
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
        // dd(1);
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
            $care['time'] = ['created_at' => date('d/m/Y', strtotime($c->created_at)), 'updated_at' => $c->created_at];

            // dd($care);

            //  = [
            //     'care_id' => $c->id,
            //     'service_id' => $c->care_service->service_id,
            //     'service_name' => $c->care_service->service->name,
            //     'content' => $c->care_service->content,


            // ];
        $care['care_services']=[];
            foreach ($c->care_service as $cs) {
                // 
            
                $a = [
                    // 'care_id' => $cs->care_id,
                    'service_id' => $cs->service->id,
                    'service_name' => $cs->service->name,
                    'content' => $cs->content,


                ];
                array_push($care['care_services'],$a);
            }

            array_push($cares, $care);
        }
        return  response()->json($cares);
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
    public function exportCare(Request $request)
    {
        $class_id=$request->class_id;
        $care_services =   Care::query()->where('class_id', $class_id)->orderBy('id', 'desc')->get();
        $care_services->load('care_service');
        $care_services->load('student');
        $care_services->load('user');
        $care_services->load('class');

        $cares = [];
        foreach ($care_services as $c) {
            $care = [];
            $care['student'] = ['id' => $c->student_id, 'name' => $c->student->fullname];
            $care['user'] = ['id' => $c->user_id, 'name' => $c->user->name];
            $care['time'] = ['created_at' => date('d/m/Y', strtotime($c->created_at)), 'updated_at' => $c->created_at];
            $care['method']=$c->method;
            $care['class']=['code'=>$c->class->code,'name'=>$c->class->name];
        $care['care_services']=[];
            foreach ($c->care_service as $cs) {
                // 
            
                $a = [
                    // 'care_id' => $cs->care_id,
                    'service_id' => $cs->service->id,
                    'service_name' => $cs->service->name,
                    'content' => $cs->content,


                ];
                array_push($care['care_services'],$a);
            }

            array_push($cares, $care);
        }
        $data['cares']=$cares;
        $data['services']=Service::where('active',1)->select('name')->get()->toArray();
        return  Excel::download(new CareExport($data),'cares.xlsx');
    }
}
