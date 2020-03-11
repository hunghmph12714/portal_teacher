<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    //
    public $table = 'classes';
    protected $fillable = ['id','center_id','course_id','code','document','active','config','fee','open_date','name','note'];
}
