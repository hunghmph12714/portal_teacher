<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class AttemptDetail extends Model
{
    //
    public $table = 'lms_attempt_details';
    protected $fillable = ['attempt_id', 'question_id', 'fib', 'options', 'essay', 'score', 'comment'];
    protected $casts = [
        'fib' => 'array',
    ];
}
