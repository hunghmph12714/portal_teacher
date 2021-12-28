<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classes extends Model
{
    protected $table = 'classes';
    public $fillable = [];
    use HasFactory;

    /**
     * The teachers that belong to the Classes
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'sessions', 'class_id', 'teacher_id');
    }
    public function sessions()
    {
        return $this->hasMany(Session::class, 'class_id');
    }
    /**
     * The roles that belong to the Classes
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_class', 'class_id', 'student_id');
    }
}