<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Attempt extends Model
{
    //
    protected $fillable = ['id','quiz_id', 'start_time', 'student_session_id', 'student_id', 'upload'];
    public $table = 'lms_attempts';
    protected $casts = ['upload' => 'array'];
    
}
