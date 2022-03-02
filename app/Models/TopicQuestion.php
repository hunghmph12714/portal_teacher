<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopicQuestion extends Model
{
    use HasFactory;
    public $table = 'lms_topic_question';
    protected $fillable = ['question_id', 'topic_id', 'type'];
}