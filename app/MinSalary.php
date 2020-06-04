<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MinSalary extends Model
{
    //
    public $table = 'min_salary';
    protected $fillable = ['domain','grade','level','salary'];
    public function teachers(){
        return $this->belongsToMany('App/Teacher','teacher_min_salary','min_salary_id','teacher_id');
    }
}
