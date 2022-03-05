<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $table = 'students';

    use HasFactory;
    /**
     * The classes that belong to the Student
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function classes()
    {
        return $this->belongsToMany('App\Models\Classes', 'student_class', 'student_id', 'class_id');
    }
    public function activeClasses()
    {
        return $this->belongsToMany('App\Models\Classes', 'student_class', 'student_id', 'class_id')->using('App\Models\StudentClass')
            ->withPivot('status', 'entrance_date', 'stats', 'id')
            ->wherePivot('status', 'active')
            ->where('classes.type', 'class')
            ->withTimestamps();
    }
}