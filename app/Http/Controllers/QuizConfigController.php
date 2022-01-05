<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\QuizConfig;
use App\Topic;
use App\Subject;
use App\Question;
use App\Syllabus;
use App\Objective;
use App\Chapter;
use App\QuizConfigTopic;
class QuizConfigController extends Controller
{
    //

    protected function create(Request $request){
        $rules = ['config' => 'required', 'quiz_config'];
        $this->validate($request, $rules);
         

        $qc['title'] = $request->config['title'];
        $qc['description'] = $request->config['description'];
        $qc['grade'] = $request->config['grade']['value'];
        $qc['duration'] = $request->config['duration'];
        $qc = QuizConfig::create($qc);

        //Add objectives;
        $objectives = array_column($request->config['objectives'], 'value');
        $qc->objectives()->sync($objectives);
        //Add topics 
        foreach($request->quiz_config as $domain){
            foreach($domain['quiz_topic'] as $k => $qt){
                $input['quiz_config_id'] = $qc->id;
                $input['topic_id'] =   $qt['topic']['value'];
                $input['quantity'] = $qt['quantity'];
                $input['question_level'] = $qt['level']['value'];
                $input['question_type'] = $qt['question_type']['value'];
                $input['score'] = $qt['score'];
                $input['subject'] = $domain['domain']['value'];
                QuizConfigTopic::create($input);
            }
        }
    }
    protected function get(){
        $qc = QuizConfig::with('topics')->with('objectives')->orderBy('id', 'DESC')->get();
        return response()->json($qc);
    }
    protected function getId(Request $request){
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $qc = QuizConfig::where('id', $request->id)->with('objectives')->first();

        $quiz_topics = QuizConfigTopic::where('quiz_config_id', $qc->id)->get();
        $quiz_configs = [];
        foreach($quiz_topics as $qt){
            $topic = Topic::find($qt->topic_id);
            $subject = Subject::find($topic->subject_id);
            $chapter = Chapter::find($subject->chapter_id);
            $syllabus = Syllabus::find($chapter->syllabus_id);

            if(array_key_exists($syllabus->title, $quiz_configs)){
                $quiz_configs[$syllabus->title]['sum_q'] += $qt->quantity;
                $quiz_configs[$syllabus->title]['sum_score'] += $qt->score*$qt->quantity;

                $quiz_configs[$syllabus->title]['quiz_topic'][] = [
                    'topic' => ['label' => $topic->title, 'value' => $topic->id],
                    'level' => $qt->question_level, 'question_type' => $qt->question_type, 
                    'score' => $qt->score, 'quantity' => $qt->quantity, 'id' => $qt->id
                ];
            }else{
                $quiz_configs[$syllabus->title] = [
                    
                        'domain' => $syllabus->subject,
                        'syllabus' => ['label' => $syllabus->title, 'value' => $syllabus->id],
                        'sum_q' => $qt->quantity,
                        'sum_score' => $qt->quantity * $qt->score,
                        'quiz_topic' => [
                            ['topic' => ['label' => $topic->title, 'value' => $topic->id],
                            'level' => $qt->question_level, 'question_type' => $qt->question_type, 
                            'score' => $qt->score, 'quantity' => $qt->quantity , 'id' => $qt->id]
                        
                    ]
                ];
            }
            
        }
        return response()->json(['qc' => $qc, 'qt' => array_values($quiz_configs)]);
    }
}
