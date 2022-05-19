<?php

namespace App\Http\Controllers;

use App\Attempt;
use App\AttemptDetail;
use App\Criteria;
use App\QuizQuestion;
use App\Session;
use App\Student;
use App\StudentClass;
use App\StudentSession;
use Illuminate\Http\Request;

class AttemptDetailController extends Controller
{
    public function craeteComment(Request $request)
    {
        $data = [
            'score' => $request->score,
            'comment' => $request->comment,
        ];
        $Attempt = AttemptDetail::find($request->id);
        $Attempt->fill($data);
        $Attempt->save();
    }
    public function getCommentById($id)
    {
        $attempt = AttemptDetail::find($id);
        return response()->json($attempt);
    }
    public function editComment($id, Request $request)
    {
        $data = [
            'score' => $request->score,
            'comment' => $request->comment,
        ];
        $Attempt = AttemptDetail::find($request->id);
        $Attempt->fill($data);
        $Attempt->save();
    }
    public function checkComplete($quiz_id)

    {
        function select(array $array, $column)
        {
            $a = [];
            foreach ($array as $ss) {
                array_push($a, $ss[$column]);
            }
            return $a;
        }
        $quiz_questions = QuizQuestion::where('quizz_id', $quiz_id)->get();
        if ($quiz_questions) {
            $quiz_questions_id = select($quiz_questions->toArray(), 'question_id');
            $attempt_detail = AttemptDetail::whereIn('question_id', $quiz_questions_id)->get();
            $arr_attempt_id = [];
            foreach ($attempt_detail as $ad) {
                // dd($ad);
                if ($ad->fib != null || $ad->assay != null && $ad->score == null) {
                    array_push($arr_attempt_id, $ad->attempt_id);
                }
            }
            $attempts = Attempt::whereIn('id', array_unique($arr_attempt_id))->get();
            $student_sessions_id = select($attempts->toArray(), 'student_session');
            $student_sessions = StudentSession::whereIn('id', $student_sessions_id)->get();
            // dd($student_sessions);
            $students_id = select($student_sessions->toArray(), 'student_id');

            $students = Student::whereIn('id', $students_id)->select('id', 'fullname')->distinct()->get();
            dd($students->toArray());
            return response()->json($students->toArray());
        }
    }
    public function checkCriteria($attempt_id)
    {
        $attempt_details = AttemptDetail::where('attempt_id', $attempt_id)
            ->join('lms_questions', 'lms_attempt_details.question_id', 'lms_questions.id')->get();
        if ($attempt_details) {
            // $attempt_details->attempt_detail;
            // $attempt_details->load('question');
            $domain = array_unique(array_column($attempt_details->toArray(), 'domain'));
            // dd(
            //     // array_values($attempt_details->toArray())
            //     $domain
            // );
            $alert = [];
            $criteria = Criteria::where('attempt_id', $attempt_id)->get();
            foreach ($domain as $d) {
                $questions_domain =  $attempt_details->where('domain', $d)->whereIn('question_type', ['fib', 'essay']);
                // dd($questions_domain);
                $i = 0;
                $j = 0;
                foreach ($questions_domain as $q) {

                    if ($q->comment == null || $q->comment == '') {
                        $j++;
                    } else {
                        $i++;
                    }
                }
                if ($i == 0 && $j != 0) {
                    $alert[$d]['comment'] = 'Chưa nhận xét';
                } elseif ($i != 0 && $j != 0) {
                    $alert[$d]['comment'] = 'Chưa nhận xét đủ';
                } else {
                    $alert[$d]['comment'] = 'Đã nhận xét đủ';
                }

                $criteria_domain = $criteria->where('domain', $d);
                // echo '<pre>';
                // dd($criteria_domain);
                if ($criteria_domain->toArray() != []) {
                    $alert[$d]['criteria'] = 'Đã có đánh giá';
                } else {
                    $alert[$d]['criteria'] = 'Chưa có đánh giá';
                }
            }

            return response()->json($alert);
        }
        return 'chưa có bài';
    }
    
     public function autoAddAttempt($session_id)
    {
        $student_sessions = StudentSession::where('session_id', $session_id)->get();
        $student_sessions->load('attempt');
        $exam=null;
        // dd( $student_sessions);
        foreach ($student_sessions as $s){
            if($s->attempt==true||$s->attempt!=null||$s->attempt){
                // dd(1);
                $exam=$s->id; 
                // break;
            }               

        }
        if($exam==null){
            dd('không có bài mẫu');
        }
        $attempt = Attempt::where('student_session',  $exam)->first();
        if ($attempt) {
            $attempt_details = AttemptDetail::where('attempt_id', $attempt->id)->get();
            if (!$attempt_details ) {
                dd('không có attempt_detail');
            }
            // dd($student_sessions);
            // dd($attempt_details );
            foreach ($student_sessions as $ss) {
                if ($ss->attempt == null || !$ss->attempt || $ss->attempt == false) {
                            //   dd(1);
                   $at = [
                        'quiz_id' =>  $attempt->quiz_id,
                        'start_time' => '2022-05-15 16:37:03',
                        'finish_time' => '2022-05-15 18:52:59',
                        'student_session' => $ss->id,

                    ];
                    // dd(   $at);
                    $creat_attempt = Attempt::create($at);
                    foreach ($attempt_details as $ad) {
                        $data_ad = [
                            'attempt_id' => $creat_attempt->id,
                            'question_id' => $ad->question_id,
                            'fib'=>[],
                            
                        ];
                        $creat_attempt_detail = AttemptDetail::create($data_ad);
                    }
                }
            }
            dd('thanh cong');
        }
        dd('không có attempt');
    }
}