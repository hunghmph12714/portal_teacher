<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentSession extends Model
{

    public $table = 'student_session';
    protected $fillable = ['student_id', 'session_id', 'attendance', 'type', 'score', 'note', 'attendance_note', 'logs', 'max_score', 'btvn_score', 'btvn_max', 'btvn_complete', 'comment', 'btvn_comment', 'checked', 'upload_exercice', 'objectives'];
    protected $casts = ['logs' => 'array', 'objectives' => 'array'];
    public $incrementing = true;

    use HasFactory;
}