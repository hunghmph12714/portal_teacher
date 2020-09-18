<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    //s
    public $table = "students";
    protected $fillable = ['parent_id','relationship_id','fullname','school','grade','email','phone','dob','address','note','gender','fee_email_log'];

    public function parents(){
        return $this->belongsTo('App\Parents');
    }
    public function classes(){
        return $this->belongsToMany('App\Classes','student_class','student_id','class_id')->using('App\StudentClass')
                    ->withPivot('status', 'entrance_date','stats')
                    ->withTimestamps();
        }
    public function sessions(){
        return $this->belongsToMany('App\Session','student_session','student_id','session_id');
    }

}
