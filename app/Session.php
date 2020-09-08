<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    //
    public $table = 'sessions';
    protected $fillable = ['id','class_id','teacher_id','center_id','room_id','document','exercice','from','to','date','ss_number','stats','exercice','status','note', 'fee','content','btvn_content','type'];
    public function students(){
        return $this->belongsToMany('App\Student', 'student_session', 'session_id', 'student_id');
    }
    public function transactions(){
        return $this->belongsToMany('App\Transaction', 'transaction_session', 'session_id', 'transaction_id')
        ->withPivot('id','amount');;
    }
    
}//ss
