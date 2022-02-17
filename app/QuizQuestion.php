<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class QuizQuestion extends Pivot
{
    public  $table = 'lms_quizz_question';
    protected $fillable = ['id', 'question_id', 'quizz_id', 'option_config', 'max_score'];
    protected $casts = [
        'option_config' => 'array',
    ];
}
