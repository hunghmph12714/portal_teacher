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
use App\Topic;
use App\Attempt;
use App\AttemptDetail;
use App\Student;
use App\Session;
use DateTime;
use DateTimeInterface;
use Illuminate\Support\Facades\Storage;

class QuizController extends Controller
{
    //
    public function checkAttempt()
    {
        $attempt = Attempt::where('start_time', '<', '2022-01-23 12:00:00')->get();
        foreach ($attempt as $a) {
            $ad = AttemptDetail::where('attempt_id', $a->id)->first();
            if (!$ad) {
                $ss = StudentSession::find($a->student_session);
                if ($ss) {
                    $student = Student::find($ss->student_id);
                    $session = Session::find($ss->session_id);
                    print_r($session->content . "-");
                    print_r($student->fullname);
                    echo "<br/>";
                }
            }
        }
        // dd($attempt);
    }
    public function genQuizNine()
    {
        $config = QuizConfig::find(33);
        $config_topic = QuizConfigTopic::query()
            ->where('quiz_config_id', $config->id)->orderBy('topic_id', 'ASC')->get();
        $quizzes = [
            'title' => $config->title,
            'duration' => $config->duration,
            'quizz_code' => random_int(1000, 9999),
            'quiz_config_id' => $config->id,
            'student_session_id' => NULL,
            'available_date' => date('Y-m-d H:i:s')
        ];
        $quiz =   Quiz::create($quizzes);
        foreach ($config_topic as $cf) {
            // $topic = Topic::find($cf->id);
            echo $cf->topic_id, '<br/>';
            $topic_question = TopicQuestion::where('topic_id', $cf->topic_id)->first();
            if ($topic_question) {
                $question = Question::find($topic_question->question_id);
                if ($question) {
                    $q_q = [
                        'question_id' => $question->id,
                        'quizz_id' => $quiz->id,
                        'max_score' =>  $cf->score,
                    ];
                    // dd($q_q);
                    $model = QuizQuestion::create($q_q);
                    $option_config = $model->option_config;
                    // print_r($item);
                    $o = Option::where('question_id', $question->id)->get();
                    foreach ($o as $k => $op) {
                        $option_config[$k] = $op->id;
                    }
                    $model->option_config  =  $option_config;
                    $model->save();
                }
            }

            // echo $cf->topic_id,"<br/>";

            // $question = Question::find($topic_question->question_id);
            // if($question){
            //     $q_q = [
            //         'question_id' => $question->id,
            //         'quizz_id' => $quiz->id,
            //         'max_score' =>  $cf->score,
            //     ];
            //     // dd($q_q);
            //     $model = QuizQuestion::create($q_q);
            //     $option_config = $model->option_config;
            //     // print_r($item);
            //     $o = Option::where('question_id', $question->id)->get();
            //     foreach ($o as $k => $op) {
            //         $option_config[$k] = $op->id;
            //     }
            //     $model->option_config  =  $option_config;
            //     $model->save();
            // }


        }
    }
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
        $student_session_id = 291284;

        //hàm dùng chung
        function select(array $array, $column)
        {
            $a = [];
            foreach ($array as $ss) {
                array_push($a, $ss[$column]);
            }
            return $a;
        }

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
        // dd($domain);

        $questions = array_flip($list_domain);
        // dd($questions);
        $tp_qt = TopicQuestion::query()
            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id');
        // dd($toan);


        foreach ($questions as $key => $item) {
            $questions[$key] = [];
        }
        $student_session = StudentSession::find($student_session_id)
            ->join('sessions', 'student_session.session_id', 'sessions.id')->first();
        // dd($student_session->from);
        $quizzes = [
            'title' => $config->title,
            'duration' => $config->duration,
            'quizz_code' => random_int(1000, 9999),
            'quiz_config_id' => $config->id,
            'student_session_id' => $student_session_id,
            // 'available_date' => $student_session->from
        ];

        $quiz =   Quiz::create($quizzes);
        //tìm ra học sinh và các câu hỏi đã thi
        {
            $student_id = StudentSession::find($student_session_id)->student_id;
            $student_session = StudentSession::where('student_id', $student_id)->get()->toArray();
            $arr_student_session_id = select($student_session, 'id');

            $attempts = Attempt::whereIn('student_session', $arr_student_session_id)->get()->toArray();
            $arr_attempt_id = select($attempts, 'id');
            // các câu hỏi mà học sinh đó đã thi
            $attempt_detail = AttemptDetail::whereIn('attempt_id', $arr_attempt_id)
                ->join('lms_questions', 'lms_attempt_details.question_id', 'lms_questions.id')->distinct()->get();

            $attempt_question = select($attempt_detail->toArray(), 'question_id');
            // $a = select($attempt_detail->whereNotNull('ref_question_id')->toArray(), 'ref_question_id');
            // dd($a);
            // dd(array_unique($a));
        }
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
                    // echo $qt->subject, '<br/>';
                    if ($qt->question_type == 'complex') {
                        $q =  TopicQuestion::where('topic_id', $qt->topic_id)
                            ->join('lms_question_objective', 'lms_topic_question.question_id', 'lms_question_objective.question_id')
                            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')
                            ->where('complex', 'sub')->where('objective_id', $objective_id)
                            ->get();
                        $r =  array_unique(array_column($q->toArray(), 'ref_question_id'));
                        array_push($rqi, $r);

                        if ($main_id == null || in_array($main_id, $rqi) == false) {

                            //Mảng chưa id các câu hỏi main  có câu sub thi
                            $attempt_detail_main = $attempt_detail->whereNotNull('ref_question_id')->toArray();
                            $main_exam_id = array_unique(select($attempt_detail_main, 'ref_question_id'));

                            $rand = array_rand($q->whereNotIn('ref_question_id', $main_exam_id)->toArray(), 1);
                            $main_id = $q[$rand]->ref_question_id;
                            // echo "test";
                            // echo $main_id, '<br/>';
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
                            ->join('lms_question_objective', 'lms_topic_question.question_id', 'lms_question_objective.question_id')
                            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')
                            ->whereNull('complex')->where('objective_id', $objective_id)
                            ->get();
                        $q_id = select($q->toArray(), 'id');


                        // cát lấy mảng các câu hỏi chưa thi để random
                        $at_n_questtion = array_diff($q_id, $attempt_question);
                        $rand = array_rand($at_n_questtion, 1);
                        $q_q = [
                            'question_id' =>
                            $at_n_questtion[$rand],
                            'quizz_id' => $quiz->id,
                            // 'option_config'
                            'max_score' =>  $qt->score,
                        ];
                        $model = QuizQuestion::create($q_q);
                        $option_config = $model->option_config;

                        $o = Option::where('question_id', $at_n_questtion[$rand])->get();

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



    public function correction(Request $request)
    {
        // dd($request->correction_upload);
        if ($request->has('correction_upload')) {
            $attempt = Attempt::find($request->attempt_id);
<<<<<<< HEAD
            if (!$attempt) {
                return back();
            }
            if ($attempt->correction_upload != null) {
                Storage::delete($attempt->correction_upload);
            }
            $file = $request->correction_upload;
            $ext = $request->correction_upload->extension();
            $file->move(public_path('lms'), $attempt->id . '.' .  $ext);
            $url = 'public/lms/' . $attempt->id . '.' .  $ext;
            $attempt->correction_upload = $url;
            $attempt->save();
=======
            // dd($attempt);
            if($attempt){
                if ($attempt->correction_upload != null) {
                    Storage::delete($attempt->correction_upload);
                }
                $file = $request->correction_upload;
                $ext = $request->correction_upload->extension();
                // dd(public_path('lms'));
                
                $file->move(public_path('lms'), $attempt->id . '.'. $ext);
                $url = 'public/lms/' . $attempt->id . '.'.  $ext;
                $attempt->correction_upload = $url;
                $attempt->save();
            }
>>>>>>> fe7daf17074d4cbaa3dd9687f8063aaebc428f14
        }
    }
}