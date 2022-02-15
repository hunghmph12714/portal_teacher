<?php

namespace App\Http\Controllers;

use App\Attempt;
use App\AttemptDetail;
use App\QuizQuestion;
use App\Student;
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
}