<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    //
    public $table = 'questions';
    protected $fillable = ['question_level', 'question_type', 
        'statement', 'content', 'complex', 'ref_question_id', 
        'public', 'hint'];
    public function topics(){
        return $this->belongsToMany('App\Topic', 'lms_topic_question','question_id','topic_id')->using('App\TopicQuestion')
            ->withPivot('type')
            ->withTimestamps();
    }
}
