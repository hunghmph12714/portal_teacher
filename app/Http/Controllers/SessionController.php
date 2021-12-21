<?php

namespace App\Http\Controllers;

use App\Models\Session;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function teacher_class($id)

    {
        $model = Session::where('teacher_id', $id)->get();
        $model->load('teacher');
        dd($model->teacher);
    }
}