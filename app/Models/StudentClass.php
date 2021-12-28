<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentClass extends Model
{
    protected $table = 'student_class';
    use HasFactory;




    /**
     * Get the students that owns the StudentClass
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'class_id');
    }
    /**
     * Get the classes that owns the StudentClass
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function classes()
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }
}