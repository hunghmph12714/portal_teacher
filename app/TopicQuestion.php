<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class TopicQuestion extends Pivot
{
    //
    public $table = 'lms_topic_question';
    protected $fillable = ['question_id', 'topic_id', 'type'];
}