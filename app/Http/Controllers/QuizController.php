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
        $student_session_id = 290907;


        // Tìm ra cấu hình
        $config = QuizConfigObjective::where('objective_id', $objective_id)
            ->join('lms_quiz_configs', 'lms_quiz_config_objective.quiz_config_id', 'lms_quiz_configs.id')->first();
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
            $tp_cf = '';
            $tp_cf = $config_topic->where('subject', $do);

            $arr_q = [];
            $main_id = null;
            $sub_id = [];
            $rqi   = [];
            if ($tp_cf->toArray() != null) {
                foreach ($tp_cf as $key => $qt) {
                    // dd($tp_cf);
                    echo $qt->subject, '<br/>';
                    if ($qt->question_type == 'complex') {
                        $q =  TopicQuestion::where('topic_id', $qt->topic_id)
                            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')
                            ->where('complex', 'sub')
                            ->get();
                        $r =  array_unique(array_column($q->toArray(), 'ref_question_id'));
                        array_push($rqi, $r);
                        if ($main_id == null || in_array($main_id, $rqi) == false) {
                            $rand = array_rand($q->toArray(), 1);
                            $main_id = $q[$rand]->ref_question_id;
                            echo "test";
                            echo $main_id, '<br/>';
                            array_push($sub_id, $q[$rand]->id);
                            $q_q = [
                                'question_id' => $q[$rand]->id,
                                'quizz_id' => $quiz->id,
                                // 'option_config'
                                'max_score' =>  $qt->score,
                            ];

                            $model = QuizQuestion::create($q_q);
                            $option_config = $model->option_config;
                            // print_r($item);
                            $o = Option::where('question_id', $q[$rand]->id)->get();
                            foreach ($o as $k => $op) {
                                $option_config[$k] = $op->id;
                            }
                            $model->option_config  =  $option_config;

                            $model->save();
                            // array_push($arr_q, $q[$rand]);
                            array_push($arr_q, $q[$rand]);
                        } else {

                            // $q_s = $q->where('ref_question_id', $main_id)->whereNotIn('question_id', $sub_id);
                            $q_s = Question::where('ref_question_id', $main_id)->whereNotIn('id', $sub_id)->get();
                            $rand = array_rand($q_s->toArray(), 1);
                            array_push($sub_id, $q_s[$rand]->id);
                            echo "<pre>";
                            print_r($sub_id);
                            $q_q = [
                                'question_id' => $q_s[$rand]->id,
                                'quizz_id' => $quiz->id,
                                'max_score' =>  $qt->score,
                            ];

                            $model = QuizQuestion::create($q_q);
                            $option_config = $model->option_config;
                            $o = Option::where('question_id', $q_s[$rand]->id)->get();
                            foreach ($o as $k => $op) {
                                $option_config[$k] = $op->id;
                            }
                            $model->option_config  =  $option_config;
                            $model->save();
                            array_push($arr_q, $q_s[$rand]);
                        }
                    } else {
                        $main_id = null;
                        // $sub_id = [];
                        $q =  TopicQuestion::where('topic_id', $qt->topic_id)
                            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')
                            ->whereNull('complex')
                            ->get();

                        // echo "<pre>";
                        // print_r($q->toArray());
                        $rand = array_rand($q->toArray(), 1);
                        $q_q = [
                            'question_id' => $q[$rand]->id,
                            'quizz_id' => $quiz->id,
                            // 'option_config'
                            'max_score' =>  $qt->score,
                        ];
                        echo "<pre>";
                        print_r($q->toArray());
                        // dd($q_q);
                        $model = QuizQuestion::create($q_q);
                        $option_config = $model->option_config;
                        // print_r($item);
                        $o = Option::where('question_id', $q[$rand]->id)->get();
                        foreach ($o as $k => $op) {
                            $option_config[$k] = $op->id;
                        }
                        $model->option_config  =  $option_config;

                        $model->save();
                        array_push($arr_q, $q[$rand]);
                    }
                }
            }
            $questions[$do] = $arr_q;
        }

        dd($questions, $quiz);
        // dd($quiz);
    }
}