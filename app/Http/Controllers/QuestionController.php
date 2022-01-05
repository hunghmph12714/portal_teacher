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
        $q['grade'] = $request->config['grade']['value'];
        $question = Question::create($q);

        //Add options
        switch ($request->question_type) {
            case 'fib':
            case 'mc':
                $o = [];
                foreach($request->options as $option){
                    $option['question_id'] = $question->id;
                    $o[] = Option::create($option);
                }
                # code...
                break;
            
            default:
                # code...
                break;
        }
        

        
        // Add topic - question
        $topics = array_column($request->config['topics'], 'value');
        $question->topics()->sync($topics);
        //Add objective
        $obj = array_column($request->config['objectives'], 'value');
        $question->objectives()->sync($obj);

        return response()->json();

        //SAVE FOR LATER BASE64 -> BOB
            // $image_parts = explode(";base64,", $request->content); 

            // $image_type_aux = explode("image/", $image_parts[3]); 

            // $image_type = $image_type_aux[1]; 

            // $image_base64 = base64_decode($image_parts[1]); 
        //
    }
    protected function getSingle(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $syllabus = [];
        $question = Question::where('id', $request->id)->with('topics')->with('objectives')->with('options')->first();
        $question->chapter = [];
        $question->syllabus = [];
        if(sizeof($question->topics) > 0){
            $subject = Subject::find($question->topics[0]['subject_id']);
            if($subject){
                $chapter = Chapter::find($subject->chapter_id);
                $question->syllabus = Syllabus::find($chapter->syllabus_id);
                $question->chapter = $chapter;
            }
        }
        return response()->json($question);
    }
    protected function edit(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $question = Question::find($request->id);
        $q['question_level'] = $request->config['level']['value'];
        $q['question_type'] = $request->question_type;
        $q['statement'] = $request->statement;
        $q['content'] = $request->content;
        $q['domain'] = $request->config['domain']['value'];
        $q['hint'] = ($request->answer)?$request->answer:'';
        $q['grade'] = $request->config['grade']['value'];
        $q = $question->update($q);
        //Update topics
        // update topic - question
        $topics = array_column($request->config['topics'], 'value');
        $question->topics()->sync($topics);
        // update objective
        $obj = array_column($request->config['objectives'], 'value');
        $question->objectives()->sync($obj);

        //update ooption
        switch ($request->question_type) {
            case 'fib':
            case 'mc':
                $o = [];
                foreach($request->options as $option){
                    if(!array_key_exists('id', $option)){
                        $option['question_id'] = $question->id;
                        $op = Option::create($option);
                        $o[] = $op->id;
                    }else{
                        Option::where('id', $option['id'])->update($option);
                        $o[] = $option['id'];
                    }
                    
                }
                $old_option = Option::where('question_id', $question->id)->select('id')->get()->toArray();
                $old_option = array_column($old_option, 'id');
                $dif = array_diff($old_option, $o);
                foreach($dif as $id){
                    Option::find($id)->forceDelete();
                }
                # code...
                break;
            
            default:
                # code...
                break;
        }
        

    }
    protected function deactive(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $q = Question::find($request->id);
        $q->active = false;
        $q->save();
    }
    protected function get(Request $request){

        $questions = Question::with('topics')->with('objectives')->with('options')->where('active',true)->orderBy('id', 'DESC')
            ->get();
        
        
        return response()->json($questions);
    }
    
}
