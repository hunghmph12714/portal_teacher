<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    public  $table = 'lms_quizz_question';
    protected $fillable = ['question_id', 'quizz_id', 'option_config', 'max_score'];
    protected $casts = [
        'option_config' => 'array',
    ];
<<<<<<< HEAD
}
=======
}
>>>>>>> 3e93deab5ab6ba383f3abb86f35d6e67e2c6a16e
