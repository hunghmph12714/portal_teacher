<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class StudentNote extends Model
{
    //
    public $table = 'student_notes';
    protected $fillable = ['user_id', 'student_id', 'class_id', 'content','created_at'];
    
}
