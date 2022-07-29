<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ClassConfig extends Model
{

    protected $table='class_config';
    public $fillable=['class_id','teacher_id','from','to','date','room_id'];
}
