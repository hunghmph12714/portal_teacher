<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Question;
use App\QuestionObjective;
use App\QuizConfig;
use App\QuizConfigObjective;
use App\StudentSession;
use App\TopicQuestion;
use App\Quiz;
use App\QuizConfigTopic;
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
        // array_unique($domain);
        // dd(array_flip($domain));
        // dd($domain);
        $questions = array_flip($list_domain);
        $tp_qt = TopicQuestion::query()
            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id');
        // dd($toan);


        foreach ($questions as $key => $item) {
            $questions[$key] = [];
        }

        // dd($questions);
        foreach ($domain as $do) {
            // dd($do);
            $subject = '';
            $subject = $config_topic->where('subject', $do);
            // dd($subject);
            $arr_q = [];

            if ($subject->toArray() != null) {
                foreach ($subject as $qt) {
                    $q =  TopicQuestion::where('topic_id', $qt->topic_id)
                        ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')->get();
                    if ($q->toArray() != null) {
                        if ($qt->quantity <= 1) {
                            $rand = array_rand($q->toArray(), 1);
                            array_push($arr_q, $q[$rand]);
                        } else {
                            $rand = array_rand($q->toArray(), $qt->quantity);
                            foreach ($rand as $item) {
                                $q[$item];
                                array_push($arr_q, $q[$item]);
                            }
                        }
                    }
                }
            }
            $questions[$do] = $arr_q;
            // dd($arr_q);
            // dd($questions[$do]);
            // dd($questions);
            // dd($subject);  
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
        // dd($quizzes);
        $quiz = new Quiz();
        $quiz->created($quizzes);



        dd($quiz);
        dd($questions);


        // //ề Tiếng Việt
        // $toan = $config_topic->where('subject', 'Toán');
        // foreach ($toan as $qt) {
        //     $q =  TopicQuestion::where('topic_id', $qt->topic_id)
        //         ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')->get();
        //     if ($qt->quantity == 1) {
        //         $rand = array_rand($q->toArray(), 1);
        //         array_push($questions['Toán'], $q[$rand]);
        //     } else {

        //         $rand = array_rand($q->toArray(), $qt->quantity);
        //         // dd($rand);
        //         foreach ($rand as $item) {
        //             $q[$item];
        //             array_push($questions['Toán'], $q[$item]);
        //         }
        //     }
        // }
        // $toan = $config_topic->where('subject', 'Tiếng Việt')->get();
        // foreach ($toan as $qt) {
        //     $q =  TopicQuestion::where('topic_id', $qt->topic_id)
        //         ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')->get();
        //     if ($qt->quantity == 1) {
        //         $rand = array_rand($q->toArray(), 1);
        //         array_push($questions['Tiếng Việt'], $q[$rand]);
        //     } else {

        //         $rand = array_rand($q->toArray(), $qt->quantity);
        //         // dd($rand);
        //         foreach ($rand as $item) {
        //             $q[$item];
        //             array_push($questions['Tiếng Việt'], $q[$item]);
        //         }
        //     }
        // }
        // $toan = $config_topic->where('subject', 'Anh')->get();
        // foreach ($toan as $qt) {
        //     $q =  TopicQuestion::where('topic_id', $qt->topic_id)
        //         ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')->get();
        //     if ($qt->quantity == 1) {
        //         $rand = array_rand($q->toArray(), 1);
        //         array_push($questions['Anh'], $q[$rand]);
        //     } else {

        //         $rand = array_rand($q->toArray(), $qt->quantity);
        //         // dd($rand);
        //         foreach ($rand as $item) {
        //             $q[$item];
        //             array_push($questions['Anh'], $q[$item]);
        //         }
        //     }
        // }
        dd($questions);
    }
}