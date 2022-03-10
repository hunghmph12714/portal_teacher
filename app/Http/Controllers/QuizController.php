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
use Mail;

class QuizController extends Controller
{
    //
    public function checkQuiz(Request $request)
    {

        $objective_id = $request->obj_id;
        // $student_session_id = 291284;

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

        $random_quiz_code = random_int(100000, 999999);
        $quizzes = [
            'title' => $config->title,
            'duration' => $config->duration,
            'quizz_code' => $random_quiz_code,
            'quiz_config_id' => $config->id,
            'student_session_id' => null,
            // 'available_date' => $student_session->from
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
                    // echo $qt->subject, '<br/>';
                    if ($qt->question_type == 'complex') {
                        $q =  TopicQuestion::where('topic_id', $qt->topic_id)
                            ->join('lms_question_objective', 'lms_topic_question.question_id', 'lms_question_objective.question_id')
                            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')
                            ->where('active', 1)->where('lms_questions.created_at', '>', '2022-02-10 10:25:10')
                            ->where('complex', 'sub')->where('objective_id', $objective_id)
                            ->get();
                        $rqi =  array_unique(array_column($q->toArray(), 'ref_question_id'));
                        // array_push($rqi, $r);
                        // $rqi = $r;
                        if ($main_id == null || in_array($main_id, $rqi) == false) {

                            //Mảng chưa id các câu hỏi main  có câu sub thi
                            // $attempt_detail_main = $attempt_detail->whereNotNull('ref_question_id')->toArray();
                            // $main_exam_id = array_unique(select($attempt_detail_main, 'ref_question_id'));

                            $rand = array_rand($q->toArray(), 1);
                            $main_id = $q[$rand]->ref_question_id;
                            // echo "test";
                            // echo $main_id, '<br/>';
                            array_push($sub_id, $q[$rand]->id);

                            $option_config = [];
                            $o = Option::where('question_id', $q[$rand]->id)->get();
                            foreach ($o as $k => $op) {
                                $option_config[$k] = $op->id;
                            }

                            $q_q = [
                                $q[$rand]->id => [
                                    'quizz_id' => $quiz->id,
                                    'max_score' =>  $qt->score,
                                    'option_config' => $option_config,
                                ]
                            ];
                            $quiz->questions()->attach($q_q);

                            array_push($arr_q, $q[$rand]);
                        } else {

                            $q_s = Question::where('ref_question_id', $main_id)->whereNotIn('id', $sub_id)->where('active', 1)->where('created_at', '>', '2022-02-10 10:25:10')->get();
                            $rand = array_rand($q_s->toArray(), 1);
                            array_push($sub_id, $q_s[$rand]->id);
                            // echo "<pre>";
                            // print_r($sub_id);
                            // echo "selected: ".$q_s[$rand]->id;

                            $option_config = [];
                            $o = Option::where('question_id', $q_s[$rand]->id)->get();
                            foreach ($o as $k => $op) {
                                $option_config[$k] = $op->id;
                            }

                            $q_q = [
                                $q_s[$rand]->id => [
                                    'quizz_id' => $quiz->id,
                                    'max_score' =>  $qt->score,
                                    'option_config' => $option_config,
                                ]
                            ];
                            $quiz->questions()->attach($q_q);
                            array_push($arr_q, $q_s[$rand]);
                        }
                    } else {
                        $main_id = null;
                        // $sub_id = [];
                        $q =  TopicQuestion::where('topic_id', $qt->topic_id)
                            ->join('lms_question_objective', 'lms_topic_question.question_id', 'lms_question_objective.question_id')
                            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')
                            ->where('active', 1)->where('lms_questions.created_at', '>', '2022-02-10 10:25:10')
                            ->whereNull('complex')->where('objective_id', $objective_id)
                            ->get();
                        // $q_id = select($q->toArray(), 'id');


                        // cát lấy mảng các câu hỏi chưa thi để random
                        // $at_n_questtion = array_diff($q_id, $attempt_question);
                        // $rand = array_rand($at_n_questtion, 1);
                        if (sizeof($q->toArray()) != 0) {
                            $rand = array_rand($q->toArray(), 1);
                        } else {
                            continue;
                        }
                        $option_config = [];
                        $o = Option::where('question_id', $q[$rand]->id)->get();
                        foreach ($o as $k => $op) {
                            $option_config[$k] = $op->id;
                        }

                        $q_q = [
                            $q[$rand]->id => [
                                'quizz_id' => $quiz->id,
                                'max_score' =>  $qt->score,
                                'option_config' => $option_config,
                            ]
                        ];
                        $quiz->questions()->attach($q_q);
                        // $model->save();
                        array_push($arr_q, $q[$rand]);
                    }
                }
            }
            $questions[$do] = $arr_q;
        }

        // dd($questions, $quiz);
        // dd($quiz);
        return $random_quiz_code;
    }
    public function getCheckQuiz(Request $request)
    {

        $rules = ['quiz_code' => 'required'];
        $this->validate($request, $rules);

        // $ss = StudentSession::find($request->ss_id);

        $quiz = Quiz::where('quizz_code', $request->quiz_code)->first();
        if ($quiz) {
            $result = [];
            //Thong tin hocj sinh
            // $result['student'] = $student->toArray();
            // $classes = $student->activeClasses()->get()->toArray();
            // $result['student']['classes'] = implode(',', array_column($classes, 'code'));
            $result['quiz'] = $quiz;
            $result['quiz']['duration'] = $quiz->duration;

            $result['questions'] = [];
            $result['packages'] = [];
            $questions = $quiz->questions()->get();
            $once = true;
            $ref_tmp = -2;
            foreach ($questions as $key => $q) {

                // Get topic
                $topics = $q->topics;
                $q->topics = $topics->toArray();

                if (!array_key_exists($q->domain, $result['packages'])) {
                    if ($once) {
                        $result['packages'][$q->domain] = ['active' => true, 'question_number' => 1, 'subject' => $q->domain];
                        $once = false;
                    } else {
                        $result['packages'][$q->domain] = ['active' => false, 'question_number' => 1, 'subject' => $q->domain];
                    }
                } else {
                    $result['packages'][$q->domain]['question_number']++;
                }
                $result['questions'][] = $q->toArray();
                $result['questions'][$key]['s_index'] = $result['packages'][$q->domain]['question_number'];
                // $result['questions'][$key]['options'] = [];
                $result['questions'][$key]['content'] = str_replace('<p></p>', '<br/>', $result['questions'][$key]['content']);
                if ($q->question_type == 'mc') {
                    foreach ($q->pivot['option_config'] as $option_id) {
                        $option = Option::find($option_id);
                        $result['questions'][$key]['options'][] = ['id' => $option->id, 'content' => $option->content];
                    }
                }
                if ($q->question_type == 'fib') {
                    for ($i = 1; $i < 20; $i++) {
                        # code...
                        $str = '{' . $i . '}';

                        $result['questions'][$key]['content'] = str_replace($str, '!@#', $result['questions'][$key]['content']);
                        // print_r($result['questions'][$key]['content']);
                    }
                }


                if ($q->complex == 'sub') {
                    if ($ref_tmp != $q->ref_question_id) {

                        $ref_tmp = $q->ref_question_id;
                        $main = Question::find($q->ref_question_id);
                        if ($main) {
                            $result['questions'][$key]['main_content'] = $main->content;
                            $result['questions'][$key]['main_statement'] = $main->statement;
                        }
                    }
                }
                // $attempt_detail = AttemptDetail::where('question_id', $q->id)->where('attempt_id', $attempt->id)->first();

            }
            $result['packages'] = array_values($result['packages']);
            // Get Comment for domain
            // $criterias = Criteria::where('attempt_id', $attempt->id)->get();
            // $result['criterias'] = $criterias->toArray();
            // $result['upload'] = $attempt->upload;

            //
            return response()->json($result);
        }
    }
    public function attemptNull()
    {
        // $event = Classes::find(401);
        $result = [];
        // $session = Session::find('18629');
        // $quiz = Quiz::where('quizz_code',$session->teacher_note)->first();
        $quiz = Quiz::find(120);

        // $students = $session->students;
        // $result[] = $session->toArray();
        // $result[$key]['students'] = [];
        $questions = $quiz->questions;
        // print_r($students->toArray());
        $a = 0;
        // foreach ($students as $k => $student) {
        //Get class
        // $ss = StudentSession::find($student->pivot['id']);
        // $attempt = Attempt::where('student_session', $student->pivot['id'])->first();
        $attempts = Attempt::where('quiz_id', $quiz->id)->get();
        foreach($attempts as $at){
            $attempt_detail = AttemptDetail::where('attempt_id', $at->id)->get();
            if (!$attempt_detail->first()) {
                // echo "<pre>";
                // print_r($student->toArray());
                //Có bài làm
                foreach ($questions as $question) {
    
                    $rnd_attempt = AttemptDetail::where('question_id', $question->id)->whereNotNull('score')->get()->random(1)->toArray()[0];
    
                    $input['attempt_id'] = $at->id;
                    $input['question_id'] = $question->id;
                    $input['updated_at'] = '2000-01-01 09:37:17';
                    $input['fib'] = $rnd_attempt['fib'];
                    $input['essay'] = $rnd_attempt['essay'];
                    $input['options'] = $rnd_attempt['options'];
                    $input['score'] = $rnd_attempt['score'];
                    $input['comment'] = $rnd_attempt['comment'];
    
                    echo "<pre>";
                    print_r($input);
                    AttemptDetail::create($input);
                }
            }
        }
        // $attempt = Attempt::find(167);
        // echo "<pre>";
        // print_r($attempt_detail);
        // echo "<pre>";
        // print_r($attempt->toArray());
        // $student->quiz_id = $attempt->quiz_id;
        // $student->start_time = date('d/m/Y H:i:s', strtotime($attempt->start_time));

        




        // echo $a;
        // dd($result);    
        // return response()->json($result);
    }

    public function checkSs()
    {
        $attempts = Attempt::all();
        foreach ($attempts as $at) {
            $ss = StudentSession::find($at->student_session);
            if (!$ss && $at->student_session) {
                echo "<pre>";
                print_r($at->toArray());
            }
        }
    }

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
        $config = QuizConfig::find(15);
        $config_topic = QuizConfigTopic::query()
            ->where('quiz_config_id', $config->id)->orderBy('topic_id', 'ASC')->get();
        $quizzes = [
            'title' => $config->title,
            'duration' => $config->duration,
            'quizz_code' => random_int(1000, 999999),
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



        $objective_id = 5;
        $student_session_id = 36020;

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
            ->where(
                'quiz_config_id',
                $config->id
            )->get();
        $list_domain = [];
        foreach ($config_topic as $d) {
            array_push($list_domain, $d->subject);
        }
        $domain =  array_flip(array_flip($list_domain));
        $questions = array_flip($list_domain);
        // dd($questions);
        $tp_qt = TopicQuestion::query()
            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id');
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

        // dd($quiz);
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
            // dd($attempt_question);
        }
        foreach ($domain as $do) {
            // dd($do);
            $tp_cf = [];
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
                            ->where('complex', 'sub')->where('objective_id', $objective_id)->where('active', 1)->where('created_at', '>', '2022-02-10 10:25:10')

                            ->get();
                        $r =  array_unique(array_column($q->toArray(), 'ref_question_id'));

                        array_push($rqi, $r);

                        if ($main_id == null || in_array($main_id, $rqi) == false) {

                            //Mảng chưa id các câu hỏi main  có câu sub thi
                            $attempt_detail_main = $attempt_detail->whereNotNull('ref_question_id')->toArray();
                            $main_exam_id = array_unique(select($attempt_detail_main, 'ref_question_id'));
                            $rand = array_rand($q->whereNotIn('ref_question_id', $main_exam_id)->toArray(), 1);
                            $main_id = $q[$rand]->ref_question_id;
                            array_push($sub_id, $q[$rand]->id);
                            $o = Option::where('question_id', $q[$rand]->id)->get();
                            $option_config = [];
                            foreach ($o as $k => $op) {
                                $option_config[$k] = $op->id;
                            }
                            // $model->option_config  =  $option_config;
                            $q_q = [
                                'question_id' => $q[$rand]->id,
                                'quizz_id' => $quiz->id,
                                'option_config' => $option_config,
                                'max_score' =>  $qt->score,
                            ];

                            $model = QuizQuestion::create($q_q);
                            $option_config = $model->option_config;

                            array_push($arr_q, $q[$rand]);
                        } else {

                            $q_s = Question::where('ref_question_id', $main_id)->whereNotIn('id', $sub_id)->where('created_at', '>', '2022-02-10 10:25:10')->get();
                            $rand = array_rand($q_s->toArray(), 1);
                            array_push($sub_id, $q_s[$rand]->id);
                            // echo "<pre>";

                            $o = Option::where('question_id', $q_s[$rand]->id)->get();
                            foreach ($o as $k => $op) {
                                $option_config[$k] = $op->id;
                            }
                            $q_q = [
                                'question_id' => $q_s[$rand]->id,
                                'quizz_id' => $quiz->id,
                                'max_score' =>  $qt->score,
                                'option_config' => $option_config,

                            ];
                            $model = QuizQuestion::create($q_q);
                            $option_config = $model->option_config;

                            $model->option_config  =  $option_config;
                            $model->save();
                            array_push($arr_q, $q_s[$rand]);
                        }
                    } else {
                        $main_id = null;
                        $q =  TopicQuestion::where('topic_id', $qt->topic_id)
                            ->join('lms_question_objective', 'lms_topic_question.question_id', 'lms_question_objective.question_id')
                            ->join('lms_questions', 'lms_topic_question.question_id', 'lms_questions.id')->where('active', 1)
                            ->whereNull('complex')->where('objective_id', $objective_id)->where('created_at', '>', '2022-02-10 10:25:10')
                            ->get();
                        $q_id = select($q->toArray(), 'id');

                        $at_n_questtion = array_diff($q_id, $attempt_question);
                        if ($at_n_questtion == null) {
                            continue;
                        }
                        // echo "<pre>";


                        // print_r($at_n_questtion);
                        // dd(1);

                        print_r($at_n_questtion);
                        // dd(1);
                        if ($at_n_questtion == null) {
                            continue;
                        }


                        // print_r($at_n_questtion);
                        // dd(1);



                        // print_r($at_n_questtion);
                        // dd(1);

                        $rand = array_rand($at_n_questtion, 1);
                        // dd($at_n_questtion, 1);
                        // dd
                        // print_r($qt->topic_id);



                        $o = Option::where('question_id', $at_n_questtion[$rand])->get();
                        $option_config = [];
                        foreach ($o as $k => $op) {
                            $option_config[$k] = $op->id;
                        }
                        $q_q = [
                            'question_id' =>
                            $at_n_questtion[$rand],
                            'quizz_id' => $quiz->id,
                            'option_config' => $option_config,
                            'max_score' =>  $qt->score,
                        ];
                        $model = QuizQuestion::create($q_q);



                        array_push($arr_q, $q[$rand]);
                    }
                }
            }
            $questions[$do] = $arr_q;
        }
    }



    public function correction(Request $request)
    {
        // dd($request->correction_upload);
        if ($request->has('correction_upload')) {
            $attempt = Attempt::find($request->attempt_id);
            // dd($attempt);
            if ($attempt) {
                if ($attempt->correction_upload != null) {
                    Storage::delete($attempt->correction_upload);
                }
                $file = $request->correction_upload;
                $ext = $request->correction_upload->extension();
                // dd(public_path('lms'));

                $file->move(public_path('lms'), $attempt->id . '.' . $ext);
                $url = 'public/lms/' . $attempt->id . '.' .  $ext;
                $attempt->correction_upload = $url;
                $attempt->save();
            }
        }
    }
    public function select(array $array, $column)
    {
        $a = [];
        foreach ($array as $ss) {
            array_push($a, $ss[$column]);
        }
        return $a;
    }
    public function sumScore($attempt_id)
    {

        function select1(array $array, $column)
        {
            $a = [];
            foreach ($array as $ss) {
                array_push($a, $ss[$column]);
            }
            return $a;
        }
        $attempt = Attempt::find($attempt_id);
        if (!$attempt) {
            return back();
        }
        $attempt_detail = AttemptDetail::where('attempt_id', $attempt_id)
            ->join('lms_questions', 'lms_attempt_details.question_id', 'lms_questions.id')->distinct()->get();
        $arr_domain =   array_unique(select1($attempt_detail->toArray(), 'domain'));
        $i = 1;
        $data = [];
        foreach ($arr_domain as $d) {
            $a = null;
            $a = $attempt_detail->where('domain', $d);
            $b = select1($a->toArray(), 'score');
            $sum = array_sum($b);
            $data = $data + ['score_domain_' . $i => $sum];
            $i++;
        }
        // dd($data);
        $attempt->fill($data)->save();
        // dd('hung');
        return $attempt;
    }
    public function sumScores()
    {
        $attempts = Attempt::get();
        foreach ($attempts as $attempt) {
            //Check attempt detail;
            $check_ad = AttemptDetail::where('attempt_id', $attempt->id)->first();
            if ($check_ad) {
                $a = $this->sumScore($attempt->id);
                print_r("<pre>");
                print_r($a->toArray());
            }
        }
    }
    public function markMc(Request $request)
    {
        $fibs = Question::where('question_type', 'mc')->where('domain', 'Tiếng Việt')->where('grade', '5')->where('created_at', '>', '2022-02-10 10:25:10')->get();
        foreach ($fibs as $fib) {
            $ad = AttemptDetail::where('question_id', $fib->id)->get();
            foreach ($ad as $a) {
                if ($a->options) {
                    $option = Option::find($a->options);
                    if ($option->weight > 0) {
                        if($fib->domain == 'Tiếng Việt'){
                            $a->score = 0.5;
                        }else{
                            $a->score = 1;
                        }
                        // echo $option->content. "<br/>";
                        $a->save();
                    } else {
                        $a->score = 0;
                        $a->save();
                    }
                }
            }
            // dd($ad->toArray());
        }
        // dd($fibs->toArray());
    }


    public function sendMailFinish($student_session_id)
    {
        $student = StudentSession::where('student_session.id', $student_session_id)
            ->join('students', 'student_session.student_id', 'students.id')
            ->select(
                'students.id as id',
                'students.fullname as student_name',
                'parents.email as email',
                'start_time',
                'finish_time',
                'quizz_code',
                'parents.phone as phone',
                'content as objective'
            )
            ->join('parents', 'students.parent_id', 'parents.id')
            ->join('lms_attempts', 'student_session.id', 'lms_attempts.student_session')
            ->join('lms_quizzes', 'lms_attempts.quiz_id', '.lms_quizzes.id')
            ->join('lms_quiz_config_objective', 'lms_quizzes.quiz_config_id', 'lms_quiz_config_objective.quiz_config_id')
            ->join('objectives', 'lms_quiz_config_objective.objective_id', 'objectives.id')
            ->groupBy('id')
            // ->get();
            ->first();

        $data = [
            'student_name' => $student->student_name,
            'email' => $student->email,
            'start_time' => $student->start_time,
            'finish_time' => $student->finish_time,
            'quizz_code' => $student->quizz_code,
            'objective' => $student->objective
        ];
        $email = $student->email;
        Mail::send('emails.events.mail-finish',  $data,  function ($message) use ($email) {
            // dd($email);
            $message->from('info@vietelite.edu.vn', 'VietElite');
            // $message->to($email, 'VietElite');
            $message->to('manhhung1762001@gmail.com', 'VietElite');
            $message->subject('Xác nhận thông tin bài thi ');
        });
        // Gửi mail cho công ty
        Mail::send('emails.events.mail-finish',  $data,  function ($message) use ($email) {
            // dd($email);
            $message->from('info@vietelite.edu.vn', 'VietElite');
            $message->to('c8db4ca6.vietelite.edu.vn@apac.teams.ms', 'VietElite');
            $message->subject('Xác nhận thông tin bài thi ');
        });
        dd('Gửi được rồi');
    }















    // public function sumScore()
    // {
    //     // $attempt_id = $request->attempt_id;
    //     $attempt_id = 247;
    //     function select1(array $array, $column)
    //     {
    //         $a = [];
    //         foreach ($array as $ss) {
    //             array_push($a, $ss[$column]);
    //         }
    //         return $a;
    //     }
    //     $attempt = Attempt::find($attempt_id);
    //     if (!$attempt) {
    //         return back();
    //     }
    //     $attempt_detail = AttemptDetail::where('attempt_id', $attempt_id)
    //         ->join('lms_questions', 'lms_attempt_details.question_id', 'lms_questions.id')
    //         ->select('lms_attempt_details.id as id', 'domain', 'question_id', 'score')->distinct('id')->get();

    //     // dd($attempt_detail->toArray());


    //     $arr_domain =   array_unique(select1($attempt_detail->toArray(), 'domain'));
    //     $arr_question = array_unique(select1($attempt_detail->toArray(), 'question_id'));

    //     $q_old = [];
    //     $atd_id = [];
    //     foreach ($attempt_detail as $a_id) {
    //         if (in_array($a_id->question_id, $q_old) == false) {
    //             array_push($q_old, $a_id->question_id);
    //             array_push($atd_id, $a_id->id);
    //         }
    //     }

    //     // dd($q_old, $atd_id);



    //     $i = 1;
    //     $data = [];


    //     foreach ($arr_domain as $d) {
    //         $a = null;

    //         $a_d =  $attempt_detail->whereIn('id', $atd_id)->where('domain', $d)->sum('score');
    //         // $b = select1($a->toArray(), 'score');
    //         // $sum = array_sum($b);        
    //         // dd(select1($a_d, 'id'));

    //         // dd($a_d);
    //         $data = $data + ['score_domain_' . $i => $a_d];
    //         $i++;
    //     }
    //     dd($data);
    //     // dd($attempt_detail->toArray());
    //     $attempt->fill($data)->save();
    //     return $attempt;
    // }
}