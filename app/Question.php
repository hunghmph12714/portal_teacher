<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    //
    public $table = 'lms_questions';
    protected $fillable = [
        'id',
        'question_level', 'question_type',
        'statement', 'content', 'complex', 'ref_question_id', 'domain',
        'public', 'hint', 'grade', 'active'
    ];
    public function topics()
    {
        return $this->belongsToMany('App\Topic', 'lms_topic_question', 'question_id', 'topic_id')->using('App\TopicQuestion')
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

    public function scopeDomain($query, $arr_domain)
    {
        if (!empty($arr_domain)) {

            if ($arr_domain) {
                $query->whereIn('domain',    $arr_domain);
            }
        }
        return $query;
    }
    public function scopeQuestionLevel($query, $arr_lever)
    {
        if (!empty($arr_lever)) {
            if ($arr_lever) {
                $query->whereIn('question_level',  $arr_lever);
            }
        }
        return $query;
    }
    public function scopeGrade($query, $arr_grade)
    {
        if (!empty($arr_grade)) {
            if ($arr_grade) {
                $query->whereIn('lms_questions.grade',  $arr_grade);
            }
        }
        return $query;
    }
    public function scopeQuestion_type($query, $arr_loai)
    {
        if (!empty($arr_loai)) {
            if ($arr_loai) {
                $query->whereIn('question_type',   $arr_loai);
            }
        }
        return $query;
    }
    public function scopeObjective($query, $arr_objective)
    {
        if (!empty($arr_objective)) {
            if ($arr_objective) {
                $query->whereIn('objective_id',   $arr_objective);
            }
        }
        return $query;
    }
    public function scopeTopic($query, $arr_topic)
    {
        if (!empty($arr_topic)) {
            if ($arr_topic) {
                $query->whereIn('topic_id',   $arr_topic);
            }
        }

        return $query;
    }
}