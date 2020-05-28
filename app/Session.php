<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    //
    public $table = 'sessions';
    protected $fillable = ['id','class_id','teacher_id','center_id','room_id','document','exercice','from','to','date','ss_number','stats'];

    public function Students(){
        return $this->belongsToMany('App/Student', 'student_session', 'session_id', 'student_id');
    }
}
