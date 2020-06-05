<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Schools;
use App\Center;
use App\Course;
class GuestController extends Controller
{
    //
    public function formPublic(){
        $schools = Schools::Select('name')->get()->toArray();
        $schools = array_column($schools, 'name');
        $centers = Center::Select('name')->where('name', 'LIKE', '%CS%')->get()->toArray();
        $centers = array_column($centers, 'name');
        // return $schools;
        return view('form-public', compact('schools','centers'));
    }
    public function getCourses(Request $request){
        $courses = Course::select('name','id','grade')->where('grade', $request->grade)->get()->toArray();
        foreach($courses as $key => $c){
            $courses[$key]['name'] = $c['name'] . ' '. $c['grade'];
        }
        return response()->json($courses);
    }
    public function handleForm(Request $request){
        print_r($request->toArray());
    }
}
