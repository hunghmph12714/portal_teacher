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
    protected function create(Request $request)
    {
        $rules = ['config' => 'required', 'question_type' => 'required'];
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
        $q['hint'] = ($request->answer) ? $request->answer : '';
        $q['grade'] = $request->config['grade']['value'];
        if ($request->question_type == 'complex') {
            $q['complex'] = 'main';
        }
        $question = Question::create($q);
        $topics = array_column($request->config['topics'], 'value');
        $obj = array_column($request->config['objectives'], 'value');

        //Add options
        switch ($request->question_type) {
            case 'fib':
            case 'mc':
                $o = [];
                foreach ($request->options as $option) {
                    $option['question_id'] = $question->id;
                    $o[] = Option::create($option);
                }
                # code...
                break;
            case 'complex':
                foreach ($request->complex_question as $cq) {
                    $q['question_level'] = $request->config['level']['value'];
                    $q['question_type'] = $cq['question_type'];
                    $q['statement'] = $cq['statement'];
                    $q['content'] = $cq['content'];
                    $q['domain'] = $request->config['domain']['value'];
                    $q['grade'] = $request->config['grade']['value'];
                    $q['complex'] = 'sub';
                    $q['ref_question_id'] = $question->id;
                    $sub_question = Question::create($q);
                    switch ($cq['question_type']) {
                        case 'fib':
                        case 'mc':
                            foreach ($cq['options'] as $option) {
                                $o = Option::create($option);
                                $o->question_id = $sub_question->id;
                                $o->save();
                            }
                            # code...
                            break;
                        default:
                            break;
                    }
                    // Add topic - question
                    $sub_question->topics()->sync($topics);
                    //Add objective
                    $sub_question->objectives()->sync($obj);
                }
            default:
                # code...
                break;
        }



        // Add topic - question
        $question->topics()->sync($topics);
        //Add objective
        $question->objectives()->sync($obj);

        return response()->json();

        //SAVE FOR LATER BASE64 -> BOBaaad
        // $image_parts = explode(";base64,", $request->content); 

        // $image_type_aux = explode("image/", $image_parts[3]); 

        // $image_type = $image_type_aux[1]; s

        // $image_base64 = base64_decode($image_parts[1]); 
        //
    }
    protected function getSingle(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $syllabus = [];
        $question = Question::where('id', $request->id)->with('topics')->with('objectives')->with('options')->first();
        $question->chapter = [];
        $question->syllabus = [];
        if (sizeof($question->topics) > 0) {
            $subject = Subject::find($question->topics[0]['subject_id']);
            if ($subject) {
                $chapter = Chapter::find($subject->chapter_id);
                $question->syllabus = Syllabus::find($chapter->syllabus_id);
                $question->chapter = $chapter;
            }
        }
        return response()->json($question);
    }
    protected function edit(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $question = Question::find($request->id);
        $q['question_level'] = $request->config['level']['value'];
        $q['question_type'] = $request->question_type;
        $q['statement'] = $request->statement;
        $q['content'] = $request->content;
        $q['domain'] = $request->config['domain']['value'];
        $q['hint'] = ($request->answer) ? $request->answer : '';
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
                foreach ($request->options as $option) {
                    if (!array_key_exists('id', $option)) {
                        $option['question_id'] = $question->id;
                        $op = Option::create($option);
                        $o[] = $op->id;
                    } else {
                        Option::where('id', $option['id'])->update($option);
                        $o[] = $option['id'];
                    }
                }
                $old_option = Option::where('question_id', $question->id)->select('id')->get()->toArray();
                $old_option = array_column($old_option, 'id');
                $dif = array_diff($old_option, $o);
                foreach ($dif as $id) {
                    Option::find($id)->forceDelete();
                }
                # code...
                break;

            default:
                # code...
                break;
        }
    }
    protected function deactive(Request $request)
    {
        $rules = ['id' => 'required'];
        $this->validate($request, $rules);

        $q = Question::find($request->id);
        $q->active = false;
        $q->save();
    }
    protected function get(Request $request)
    {

        $questions = Question::with('topics')->with('objectives')->with('options')->where('active', true)->orderBy('id', 'DESC')
            ->get();

        return response()->json($questions);
    }
    protected function filter(Request $request)
    {
        // dd($request);
        $questions   = Question::query()


            ->with('topics')->with('objectives')->with('options')
            ->join('lms_topic_question', 'lms_questions.id', '=', 'lms_topic_question.question_id')
            // ->select('topic_id', 'domain', 'question_level', 'grade')
            ->join('lms_topics', 'lms_topic_question.topic_id', '=', 'lms_topics.id')
            ->join('lms_question_objective', 'lms_questions.id', '=', 'lms_question_objective.question_id')
            ->join('objectives', 'lms_question_objective.objective_id', '=', 'objectives.id')
            ->select(
                'lms_questions.id as id',
                'title',
                'topic_id',
                'lms_question_objective.question_id',
                'lms_question_objective.objective_id',
                'question_level',
                'question_type',
                'statement',
                'lms_questions.content',
                'complex',
                'domain',
                'public',
                'hint',
                'active',
                // 'objectives.content',
                'user_id',
                'lms_questions.grade'
            )
            ->domain($request)
            ->questionLevel($request)
            ->grade($request)
            ->topics($request)
            ->objectives($request)
            ->where('active', true)->orderBy('id', 'DESC')->distinct()
            ->get();

        return response()->json($questions);
    }
}