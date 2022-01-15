<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Question;
use App\QuizConfig;
use App\Option;
use App\StudentSession;
use App\QuizQuestion;

class QuizController extends Controller
{
    //
    public function generateQuiz(Request $request){
        $rules = [];
        $this->validate($request, $rules);

        $qc = QuizConfig::find($request->config_id);
        
        print_r($qc);
        
    }
    public function genQuiz(){
        $question = Question::all();

        foreach($question as $q){
            $quiz['question_id'] = $q->id;
            $quiz['quizz_id'] = 1;
            $quiz['max_score'] = 1;
            if($q->question_type == 'mc'){
                $options = Option::where('question_id', $q->id)->select('id')->get()->toArray();
                $options = array_column($options, 'id');
                $quiz['option_config'] = $options;
            }
            QuizQuestion::create($quiz);
        }
    }
}
