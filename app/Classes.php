<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    //
    public $table = 'classes';
    protected $fillable = ['id','center_id','course_id','code','document','active','config','fee','open_date','name','note','student_number'];
    public function sessions(){
        return $this->hasMany('App\Session','class_id','id');
    }
    public function students(){
        return $this->belongsToMany('App\Student','student_class','class_id','student_id');
    }
}
