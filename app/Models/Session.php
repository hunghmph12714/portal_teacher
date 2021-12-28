<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class Session extends Pivot
{
    protected $table = 'sessions';
    protected $fillable = ['teacher_id', 'class_id'];
    public function classes()
    {
        return $this->belongsTo(Classes::class, 'class_id');
    }
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }
}