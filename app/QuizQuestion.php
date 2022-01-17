<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
<<<<<<< HEAD
    //
    public $table = 'lms_quizz_question';
    protected $fillable = ['question_id', 'quizz_id', 'option_config', 'max_score'];
    protected $casts = ['option_config' => 'array'];

}
=======
    public  $table = 'lms_quizz_question';
    protected $fillable = ['question_id', 'quizz_id', 'option_config', 'max_score'];
    protected $casts = [
        'option_config' => 'array',
    ];
}
>>>>>>> 65504c2e2028eafaf0980503d24c0a625fb3eb7d
