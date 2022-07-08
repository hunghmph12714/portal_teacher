<?php

namespace App\Http\Controllers;

use App\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function addService(Request $request)
    {
        if ($request->active == false)
            $request->active == 0;
        // $create = ['name' => $request->name,];
        Service::create($request->all());
        return redirect(route('service.list'));
    }

    public function editForm($id)
    {
        $service = Service::find($id);
        if ($service)
            return view('cares.edit_service', compact('service'));
    }

    public function saveEdit($id, Request $request)
    {
        $service = Service::find($id);
        if ($service) {

            $service->fill($request->all())->save();
            if ($request->active == false) {
                $service->active = 0;
                $service->save();

            }
            return redirect(route('service.list'));
        }
    }
    public function list()
    {
        $services = Service::query()->orderBy('created_at', 'desc')->paginate(10);
        return view('cares.list_service', compact('services'));
    }
    public function editActive(Request $request)
    {
        // 
        if ($request->active == true  && sizeof($request->active) > 0) {
            // dd($request);
            foreach ($request->active as $k => $a) {
                $service = Service::find($a);
                if ($service) {

                    $service->active = 1;
                    $service->save();
                }
            }
        }
        if ($request->active == true) {
            $services = Service::whereNotIn('id', $request->active)->get();
        } else {
            $services = Service::all();
        }
        // dd($request,$services);
        foreach ($services as $s) {
            $s->active = 0;
            $s->save();
        }
        return back();
    }
}
