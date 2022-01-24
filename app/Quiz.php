<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    //
    public $table = 'lms_quizzes';
    protected $fillable = ['id', 'title', 'quizz_code', 'duration', 'available_date', 'topic_id', 'quiz_config_id', 'student_session_id'];
    public function questions(){
        return $this->belongsToMany('App\Question','lms_quizz_question','quizz_id','question_id')->using('App\QuizQuestion')
                    ->withPivot('option_config', 'max_score')
                    ->withTimestamps();
    }
}