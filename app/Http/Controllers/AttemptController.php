<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use App\Models\AttemptDetail;
use App\Models\Criteria;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\Student;
use Illuminate\Http\Request;
use PhpOption\Option;

class AttemptController extends Controller
{
    protected function getAttempt1($attempt_id)
    {
        $attempt = Attempt::find($attempt_id);
        if ($attempt) {


            $attempt_detail = AttemptDetail::where('attempt_id', $attempt->id)
                ->join('lms_questions', 'lms_attempt_details.question_id', 'lms_questions.id')

                ->get();
            dd($attempt_detail);

            return view('attempts.attempt-detail', compact('attempt_detail'));
        }
    }
    protected function getAttempt($attempt_id)
    {

        $attempt = Attempt::where('id', $attempt_id)->first();
        if ($attempt) {
            $quiz = Quiz::find($attempt->quiz_id);
            if ($quiz) {
                $result = [];
                //Thong tin hocj sinh
                // $result['student'] = $student->toArray();
                // $classes = $student->activeClasses()->get()->toArray();
                // $result['student']['classes'] = implode(',', array_column($classes, 'code'));
                // $result['quiz'] = $quiz;
                // $result['quiz']['duration'] = $quiz->duration;
                // $result['quiz']['attempt_id'] = $attempt->id;
                // $result['quiz']['correction_upload'] = $attempt->correction_upload;
                // if (!$result['quiz']['student_session_id']) {
                //     $result['quiz']['student_session_id'] = $request->ss_id;
                // }
                $result['questions'] = [];
                $result['packages'] = [];
                $questions = $quiz->questions()->get();
                $once = true;
                $ref_tmp = -2;
                foreach ($questions as $key => $q) {
                    echo '<pre> ';
                    print_r($q->pivot['option_config']);
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

                    // dd($result['questions'][$key]['content']);
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
                    $attempt_detail = AttemptDetail::where('question_id', $q->id)->where('attempt_id', $attempt->id)->first();
                    $result['questions'][$key]['a_essay'] = '';
                    $result['questions'][$key]['a_option'] = '';
                    $result['questions'][$key]['a_fib'] = '';
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
                }
                $result['packages'] = array_values($result['packages']);
                // Get Comment for domain
                $criterias = Criteria::where('attempt_id', $attempt->id)->get();
                $result['criterias'] = $criterias->toArray();
                $result['upload'] = $attempt->upload;

                //
                dd($result);
                return response()->json($result);
            }
        }
    }
}