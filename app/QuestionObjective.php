<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class QuestionObjective extends Pivot
{
    //
    public $table = 'lms_question_objective';
    protected $fillable = ['question_id', 'objective_id'];
}
