<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    use HasFactory;
    public $table = 'lms_topics';
    protected $fillable = ['subject_id', 'title', 'content'];
}