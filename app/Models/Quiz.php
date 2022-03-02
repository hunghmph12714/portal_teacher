<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;
    public $table = 'lms_quizzes';
    protected $fillable = ['id', 'title', 'quizz_code', 'duration', 'available_date', 'topic_id', 'quiz_config_id', 'student_session_id'];
    public function questions()
    {
        return $this->belongsToMany('App\Models\Question', 'lms_quizz_question', 'quizz_id', 'question_id')
            ->withPivot('option_config', 'max_score')
            ->withTimestamps();
    }
}