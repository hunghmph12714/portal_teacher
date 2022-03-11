<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use App\Models\AttemptDetail;
use App\Models\Criteria;
use App\Models\Option as ModelsOption;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Models\Option;
use Str;

class AttemptController extends Controller
{
    // protected function getAttempt1($attempt_id)
    // {
    //     $attempt = Attempt::find($attempt_id);
    //     if ($attempt) {


    //         $attempt_detail = AttemptDetail::where('attempt_id', $attempt->id)
    //             ->join('lms_questions', 'lms_attempt_details.question_id', 'lms_questions.id')

    //             ->get();
    //         dd($attempt_detail);

    //         return view('attempts.attempt-detail', compact('attempt_detail'));
    //     }
    // }
    protected function getAttempt($attempt_id)
    {
        if (!empty($_GET['domain'])) {
            $domain = $_GET['domain'];
        }
        $attempt = Attempt::where('lms_attempts.id', $attempt_id)
            ->join('student_session', 'lms_attempts.student_session', 'student_session.id')
            ->join('students', 'student_session.student_id', 'students.id')
            ->first();
        // dd($attempt-);
        if ($attempt) {
            $quiz = Quiz::find($attempt->quiz_id);
            // dd($quiz->questions()->get());
            if ($quiz) {
                $result = [];
                //Thong tin hocj sinh
                $result['student'] = $attempt->fullname;
                // // $classes = $attempt->activeClasses()->get()->toArray();
                // // $result['student']['classes'] = implode(',', array_column($classes, 'code'));
                // $result['quiz'] = $quiz;
                $result['quiz']['duration'] = $quiz->duration;
                $result['quiz']['attempt_id'] = $attempt->id;
                $result['quiz']['start_time'] = $attempt->start_time;
                $result['quiz']['finish_time'] = $attempt->finish_time;

                $result['quiz']['correction_upload'] = $attempt->correction_upload;
                // if (!$result['quiz']['student_session_id']) {
                //     $result['quiz']['student_session_id'] = $request->ss_id;
                // }
                $result['questions'] = [];
                $result['packages'] = [];
                $arr_domain = array_unique(array_column($quiz->questions()->get()->toArray(), 'domain'));
                $result['domain'] = [];

                // dd($arr_domain);
                if (!empty($domain)) {
                    $questions = $quiz->questions()->where('domain', $domain)->get();
                } else {
                    $questions = $quiz->questions()->get();
                }
                $j = 1;
                foreach ($arr_domain as $d) {
                    $a = [];
                    $q_number =  $quiz->questions()->where('domain', $d)->count();
                    $score = $attempt->toArray();
                    // dd($score, $j);
                    $a = [
                        'domain' => $d,
                        'question_number' => $q_number,
                        'score' => $score['score_domain_' . $j]

                    ];
                    array_push($result['domain'], $a);
                    $j++;
                }
                // $qt=Q
                // dd($questions);
                $once = true;
                $ref_tmp = -2;
                foreach ($questions as $key => $q) {
                    // echo '<pre> ';
                    // print_r($q->pivot['option_config']);
                    // $quiz_question = QuizQuestion::where('quizz_id', $quiz->id)->where('question_id', $q->id)->first();
                    // if ($quiz_question) {
                    //     echo "<pre>";
                    //     print_r($quiz_question->option_config);
                    // }

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
                            $option = ModelsOption::find($option_id);
                            $result['questions'][$key]['options'][] = ['id' => $option->id, 'content' => $option->content];
                        }
                    }
                    // if ($q->question_type == 'fib') {
                    //     for ($i = 1; $i < 20; $i++) {
                    //         # code...
                    //         $str = '{' . $i . '}';

                    //         // $result['questions'][$key]['content'] = str_replace($str, '<input type="text" value=' . '>', $result['questions'][$key]['content']);
                    //         $result['questions'][$key]['content'] = str_replace($str, '!@#', $result['questions'][$key]['content']);

                    //         // print_r($result['questions'][$key]['content']);
                    //     }
                    // }

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
                    $attempt_detail = AttemptDetail::where('question_id', $q->id)->where('attempt_id', $attempt_id)->first();
                    $attempt_detail = AttemptDetail::where('question_id', $q->id)->where('attempt_id', $attempt_id)->first();
                    $result['questions'][$key]['a_essay'] = '';
                    $result['questions'][$key]['a_option'] = '';
                    $result['questions'][$key]['a_fib'] = [];
                    $result['questions'][$key]['done'] = true;
                    $result['questions'][$key]['score'] = NULL;
                    $result['questions'][$key]['comment'] = NULL;
                    $result['questions'][$key]['attempt_detail_id'] = NULL;
                    if ($attempt_detail) {
                        $result['questions'][$key]['a_essay'] = $attempt_detail->essay;
                        $result['questions'][$key]['a_option'] = $attempt_detail->options;
                        $result['questions'][$key]['a_fib'] = $attempt_detail->fib;
                        $result['questions'][$key]['score'] = $attempt_detail->score;
                        $result['questions'][$key]['comment'] = $attempt_detail->comment;
                        $result['questions'][$key]['done'] = true;
                        $result['questions'][$key]['attempt_detail_id'] = $attempt_detail->id;
                    }
                    if ($q->question_type == 'fib') {
                        // dd($result['questions'][$key]);
                        foreach ($result['questions'][$key]['a_fib'] as $index => $f) {
                            // echo '<br>';
                            $index = $index + 1;
                            // print_r($result['questions'][$key]['a_fib']);
                            $str = '{' . $index . '}';

                            $result['questions'][$key]['content'] = str_replace($str, '<input class="form-control border-success" disabled type="text" value="' .  $f . '" >', $result['questions'][$key]['content']);
                        }
                        for ($i = 1; $i < 20; $i++) {
                            # code...
                            $str = '{' . $i . '}';

                            // $result['questions'][$key]['content'] = str_replace($str, '<input type="text" value=' . '>', $result['questions'][$key]['content']);
                            $result['questions'][$key]['content'] = str_replace($str, '<input class="form-control border-danger" disabled type="text" value= "">', $result['questions'][$key]['content']);

                            // dd($result['questions'][$key]['content']);
                        }
                    }
                }
                $result['packages'] = array_values($result['packages']);
                // Get Comment for domain
                if (!empty($domain)) {
                    $criterias = Criteria::where('attempt_id', $attempt_id)->where('domain', $domain)->get();
                } else {
                    $criterias = Criteria::where('attempt_id', $attempt_id)->get();
                }
                $result['criterias'] = $criterias->toArray();
                $result['upload'] = $attempt->upload;
                $result['int'] = 20;



                //
                // dd($result);

                // dd(array_column($result['questions'], 'co'));
                // str_word_count()
                return view('attempts.attempt-detail', compact('result'));
            }
        }
    }
}