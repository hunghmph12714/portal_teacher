<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    use HasFactory;
    public $table = 'lms_options';
    protected $fillable = ['question_id', 'content', 'weight', 'set', 'order'];
}