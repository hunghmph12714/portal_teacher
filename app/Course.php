<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    //
    public $table = 'courses';
    protected $fillable = ['id','name','grade','document','fee','class_per_week','session_per_class','domain','showable'];
}
