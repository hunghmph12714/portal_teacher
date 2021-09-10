<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Center;

class CenterController extends Controller
{
    //d
    protected function index(){
        $center = Center::all()->toArray();
        array_push($center, [
            'id' => -1,
            'name' => 'Tất cả cơ sở',
            'code' => 'all',
        ]);                                                         
        return response()->json($center);
    }

    protected function create(Request $request){
        // print_r($request->toArray());
        $rules = ['name' => 'required', 'code'=>'required'];
        $this->validate($request, $rules);

        $input = $request->toArray();
        $center = Center::create($input);
        return response()->json($center);

    }
    protected function edit(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $center = Center::find($request->id);
        $newData = $request->newData;
        if($center){
            $center->name = $newData['name'];
            $center->address = $newData['address'];
            $center->email = $newData['email'];
            $center->phone = $newData['phone'];
            $center->code = $newData['code'];
            //test
            $center->save();
            return response()->json(200);
        }
        else{
            return response()->json('Không tìm thấy cơ sở', 402);
        }
    }
    protected function delete(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $center = Center::find($request->id)->forceDelete();
        return response()->json(200);
    }
        
}
