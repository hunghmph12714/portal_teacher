<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Schools;
class StudentController extends Controller
{
    //
    public function findSchool($key){
        $schools = Schools::where('name', 'LIKE', '%'.$key.'%')->limit(10)->get()->toArray();
        return response()->json($schools);
    }
}
