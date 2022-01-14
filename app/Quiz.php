<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    //
    public $table = 'lms_quizzes';
    protected $fillable = ['id', 'title', 'quizz_code', 'duration', 'available_date', 'topic_id', 'quiz_config_id', 'student_session_id'];
}
