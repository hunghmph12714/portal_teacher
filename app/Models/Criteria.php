<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    use HasFactory;
    public $table = 'lms_criterias';
    protected $fillable = ['attempt_id', 'domain', 'content', 'title', 'total_score'];
}