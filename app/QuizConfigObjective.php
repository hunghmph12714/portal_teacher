<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class QuizConfigObjective extends Pivot
{
    //
    public $table='lms_quiz_config_objective';
    protected $fillable = ['objective_id','quiz_config_id','weight'];
}
