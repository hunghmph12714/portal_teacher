<?php

namespace App\Http\Controllers;

use App\Option;
use Illuminate\Http\Request;
use App\Question;
use App\QuestionObjective;
use App\QuizConfig;
use App\QuizConfigObjective;
use App\StudentSession;
use App\TopicQuestion;
use App\Quiz;
use App\QuizConfigTopic;
use App\QuizQuestion;
use DateTime;
use DateTimeInterface;

class QuizController extends Controller
{
    //
    public function generateQuiz(Request $request)
    {
        $rules = [];
        $this->validate($request, $rules);

        $qc = QuizConfig::find($request->config_id);

        print_r($qc);
    }
    public function genQuiz()
    {
        $question = Question::all();

        foreach ($question as $q) {
            $quiz['question_id'] = $q->id;
            $quiz['quizz_id'] = 1;
            $quiz['max_score'] = 1;
            if ($q->question_type == 'mc') {
                $options = Option::where('question_id', $q->id)->select('id')->get()->toArray();
                $options = array_column($options, 'id');
                $quiz['option_config'] = $options;
            }
            QuizQuestion::create($quiz);
        }
    }

    protected function configuration(Request $request)
    {
        // $objective_id = $request->objective_id;

        // $student_session_id = $request->student_session_id;

        $objective_id = 2;
        $student_session_id = 305;


        // Tìm ra cấu hình
        $config = QuizConfigObjective::where('objective_id', $objective_id)->first()
            ->join('lms_quiz_configs', 'lms_quiz_config_objective.quiz_config_id', 'lms_quiz_configs.id')->first();
        // dd($config);
        $config_topic = QuizConfigTopic::query()
            ->where('quiz_config_id', $config->id)->get();
        $list_domain = [];
        foreach ($config_topic as $d) {
            array_push($list_domain, $d->subject);
        }
        $domain =  array_flip(array_flip($list_domain));

        $questions = array_flip($list_domain);
        $tp_qt = TopicQuestion::query()
            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id');
        // dd($toan);


        foreach ($questions as $key => $item) {
            $questions[$key] = [];
        }
        $student_session = StudentSession::find($student_session_id)
            ->join('sessions', 'student_session.session_id', 'sessions.id')->first();
        // dd($student_session->frmm);
        $quizzes = [
            'title' => $config->title,
            'duration' => $config->duration,
            'quizz_code' => random_int(1000, 9999),
            'quiz_config_id' => $config->id,
            'student_session_id' => $student_session_id,
            'available_date' => $student_session->from
        ];

        $quiz =   Quiz::create($quizzes);
        foreach ($domain as $do) {
            // dd($do);
            $subject = '';
            $subject = $config_topic->where('subject', $do);
            // dd($subject);
            $arr_q = [];
            $main = [];
            $sub_id = [];
            if ($subject->toArray() != null) {
                foreach ($subject as $qt) {
                    $q =  TopicQuestion::where('topic_id', $qt->topic_id)
                        ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')
                        ->whereNotIn('complex', ['main'])
                        ->orWhereNull('complex')
                        ->get();
                    // dd($q);
                    if ($q->toArray() != null) {
                        if ($qt->quantity <= 1) {

                            $rand = array_rand($q->toArray(), 1);

                            if ($q[$rand]->complex == 'sub') {
                                // dd($q[$rand]);
                                $i = 0;
                                foreach ($main as $m) {

                                    if ($m == $q[$rand]->ref_question_id) {
                                        // dd($q);
                                        $question_sub = $q->where('rep_question_id', $m)
                                            ->whereNotIn('id', $sub_id)->where('complex', 'sub');
                                        // dd($question_sub);
                                        if ($question_sub != null) {
                                            //nếu tồn tại $question_sub 
                                            // dd($question_sub);
                                            $i = 1;
                                            $rand_sub = array_rand($question_sub->toArray(), 1);
                                            $q[$rand] = $q[$rand_sub];
                                            // dd($q[$rand]);

                                            array_push($sub_id, $q[$rand]);
                                            break;
                                        }
                                        // dd($m);
                                        // // Loại trừ những thằng đã có
                                        // break;
                                    }
                                }
                                if ($i == 0) {
                                    // dd($q[$rand]);
                                    array_push($main, $q[$rand]->ref_question_id);
                                }
                            }

                            // $rand = array_rand($q->toArray(), 1);
                            // dd($q[$rand], 'm');

                            $q_q = [
                                'question_id' => $q[$rand],
                                'quizz_id' => $quiz->id,
                                // 'option_config'
                                'max_score' =>  $qt->score,
                            ];

                            $model = QuizQuestion::create($q_q);
                            $option_config = $model->option_config;
                            // print_r($item);
                            $o = Option::where('question_id', $q[$rand]->id)->get();
                            foreach ($o as $key => $op) {
                                $option_config[$key] = $op->id;
                            }
                            $model->option_config  =  $option_config;

                            $model->save();
                            array_push($arr_q, $q[$rand]);
                        } else {
                            $rand = array_rand($q->toArray(), $qt->quantity);
                            foreach ($rand as $item) {
                                $q_q = [
                                    'question_id' => $q[$item]->id,
                                    'quizz_id' => $quiz->id,
                                    // 'option_config'
                                    'max_score' =>  $qt->score,
                                ];
                                $model = QuizQuestion::create($q_q);
                                $option_config = $model->option_config;
                                $o = Option::where('question_id', $q[$item]->id)->get();
                                foreach ($o as $key => $op) {
                                    $option_config[$key] = $op->id;
                                }
                                $model->option_config  =  $option_config;

                                $model->save();
                                // dd($option);
                                // $q[$item];
                                array_push($arr_q, $q[$item]);
                            }
                        }
                    }
                }
            }
            $questions[$do] = $arr_q;
        }

        dd($questions, $quiz);
        dd($quiz);
    }
}