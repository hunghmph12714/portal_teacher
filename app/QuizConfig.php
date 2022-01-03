<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class QuizConfig extends Model
{
    //
    public $table = 'lms_quiz_configs';
    protected $fillable = ['id', 'title', 'description', 'type', 'duration','grade'];

    public function objectives(){
        return $this->belongsToMany('App\Objective', 'lms_quiz_config_objective', 'quiz_config_id', 'objective_id')->using('App\QuizConfigObjective')
            ->withTimestamps();
    }
    public function topics(){
        return $this->belongsToMany('App\Topic', 'lms_quiz_config_topic', 'quiz_config_id', 'topic_id')->using('App\QuizConfigTopic')
            ->withTimestamps();
    }
}
