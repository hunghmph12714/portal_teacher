<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Syllabus;
class SyllabusController extends Controller
{
    //
    protected function createSyllabus(Request $request){
        $rules = [
            'title' => 'required',
            'grade' => 'required',
            'subject' => 'required',
            'public' => 'required',
        ];
        $this->validate($request, $rules);
        
        $s = Syllabus::create($request->toArray());

        return response()->json($s);
    }   
    protected function getSyllabus($id){
        return response()->json($id);
    }
}
