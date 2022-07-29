<?php

namespace App\Models;

use App\Models\Entrance;
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
    /**
     * Get the entrance associated with the Student
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function entrance($class_id,$student_id)
    {
        return $this->hasMany(Entrance::class, 'class_id', 'id')->wherePivot('entrances.student_id',$student_id)
            ->where('class_id', $class_id);
    }
    
}
