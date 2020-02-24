<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    //
    public $table = 'teacher';
    protected $fillable = ['id' ,'name', 'email', 'phone', 'school', 'address','domain','contract','percent_salary',
        'salary_per_hour','basic_salary_id','insurance','personal_tax'];
    
}
