<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Parents extends Model
{
    //
    public $table = 'parents';
    protected $fillable = ['id', 'fullname', 'relationship_id', 'phone', 'email', 'note', 'alt_fullname', 'alt_phone', 'alt_email', 'tra_cuu', 'sbd', 'ftp'];
    public function students()
    {
        return $this->hasMany('App\Student', 'parent_id');
    }
    public function activeClasses()
    {
        return $this->belongsToMany('App\Classes', 'student_class', 'student_id', 'class_id')->using('App\StudentClass')
            ->withPivot('status', 'entrance_date', 'stats', 'id')
            ->wherePivot('status', 'active')
            ->where('classes.type', 'class')
            ->withTimestamps();
    }
}