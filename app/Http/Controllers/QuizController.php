<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Question;
use App\QuizConfig;
use App\StudentSession;

class QuizController extends Controller
{
    //
    public function generateQuiz(Request $request){
        $rules = [];
        $this->validate($request, $rules);

        $qc = QuizConfig::find($request->config_id);
        
        print_r($qc);
        
    }
}
