<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Care extends Model
{
    protected $table = 'cares';
    public $fillable = ['student_id', 'class_id', 'method', 'user_id'];

    /**
     * Get all of the service_care for the Care
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function care_service()
    {
        return $this->hasMany(CareService::class, 'care_id', 'id');
    }
    /**
     * Get the student that owns the Care
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function class()
    {
        return $this->belongsTo(Classes::class, 'class_id', 'id');
    }
}
