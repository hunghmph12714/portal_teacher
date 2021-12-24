<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Topic;
use App\Question;
use App\TopicQuestion;
use App\Subject;
use App\Chapter;
use App\Syllabus;
use App\Option;
class QuestionController extends Controller
{
    //
    protected function create(Request $request){
        $rules = ['config' => 'required', 'question_type' => 'required', 'content' => 'required'];
        $this->validate($request, $rules);
        // protected $fillable = ['question_level', 'question_type', 
        // 'statement', 'content', 'complex', 'ref_question_id', 'domain', 
        // 'public', 'hint'];

        //Create question
        $q['question_level'] = $request->config['level']['value'];
        $q['question_type'] = $request->question_type;
        $q['statement'] = $request->statement;
        $q['content'] = $request->content;
        $q['domain'] = $request->config['domain']['value'];
        $q['hint'] = ($request->answer)?$request->answer:'';
        $question = Question::create($q);

        //Add options
        $o = [];
        foreach($request->options as $option){
            $option['question_id'] = $question->id;
            $o[] = Option::create($option);
        }

        
        // Add topic - question
        $topics = array_column($request->config['topics'], 'value');
        $question->topics()->sync($topics);
        //Add objective
        $obj = array_column($request->config['objectives'], 'value');
        $question->objectives()->sync($obj);

        return response()->json($o);

        //SAVE FOR LATER BASE64 -> BOB
            // $image_parts = explode(";base64,", $request->content); 

            // $image_type_aux = explode("image/", $image_parts[3]); 

            // $image_type = $image_type_aux[1]; 

            // $image_base64 = base64_decode($image_parts[1]); 
        //


        

    }
    protected function get(Request $request){

        $questions = Question::get();
        return response()->json($questions);
    }
    
}
