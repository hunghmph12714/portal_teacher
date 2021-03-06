<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;
    public $table = 'lms_questions';
    protected $fillable = [
        'question_level', 'question_type',
        'statement', 'content', 'complex', 'ref_question_id', 'domain',
        'public', 'hint', 'grade', 'active'
    ];
    public function topics()
    {
        return $this->belongsToMany(Topic::class, 'lms_topic_question', 'question_id', 'topic_id')
            // ->using(TopicQuestion::class)
            ->withPivot('type')
            ->withTimestamps();
    }
    public function objectives()
    {
        return $this->belongsToMany('App\Objective', 'lms_question_objective', 'question_id', 'objective_id')->using('App\QuestionObjective')
            ->withTimestamps();
    }
    public function options()
    {
        return $this->hasMany('App\Option', 'question_id', 'id');
    }
    protected $casts = [
        'option_config' => 'array',
    ];
}