<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attempt extends Model
{
    use HasFactory;
    protected $fillable = ['id', 'quiz_id', 'start_time', 'student_session_id', 'student_id', 'upload', 'score_domain_1', 'score_domain_2', 'score_domain_3'];
    public $table = 'lms_attempts';
    protected $casts = ['upload' => 'array'];
}