<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TeacherMinSalary extends Model
{
    //
    public $table = 'teacher_min_salary';
    protected $fillable = ['id','teacher_id','min_salary_id'];
    
}
