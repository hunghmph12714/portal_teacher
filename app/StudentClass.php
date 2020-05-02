<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class StudentClass extends Pivot
{
    //
    public $table = 'student_class';
    protected $fillable = ['student_id','class_id','entrance_date','status','stats','updated_at','created_at'];
    public $incrementing = true;
    public $timestamps = true;
}
