<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    //
    public $table = 'teacher';
    protected $fillable = [
        'id', 'name', 'email', 'phone', 'school', 'address', 'domain', 'contract', 'percent_salary', 'system_teacher', 'password', 'remember_token',
        'first_password', 'sent_otp_at', 'otp', 'percent', 'referral_code',
        'salary_per_hour', 'basic_salary_id', 'insurance', 'personal_tax'
    ];
    public function minSalary()
    {
        return $this->belongsToMany('App\MinSalary', 'teacher_min_salary', 'teacher_id', 'min_salary_id');
    }
}