<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    //
    public $table = 'lms_questions';
    protected $fillable = [
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

    public function scopeDomain($query, $request)
    {
        if (!empty($request->config['domain'])) {

            if ($request->config['domain']['value']) {
                $query->where('domain', 'like', '%' . $request->config['domain']['value'] . '%');
            }
        }

        return $query;
    }

    public function scopeQuestionLevel($query, $request)
    {
        if (!empty($request->config['level'])) {
            if ($request->config['level']['value']) {
                $query->where('question_level', 'like', '%' . $request->config['level']['value'] . '%');
            }
        }
        return $query;
    }
    public function scopeGrade($query, $request)
    {
        if (!empty($request->config['grade'])) {
            if ($request->config['grade']['value']) {
                $query->where('lms_questions.grade',  $request->config['grade']['value']);
            }
        }

        return $query;
    }

    public function scopeTopics($query, $request)
    {
        if (!empty($request->config['topics'])) {


            if ($request->config['topics']) {
                $t = [];
                foreach ($request->config['topics'] as $tp) {
                    array_push($t, $tp['value']);
                }
                $query->WhereIn('lms_topic_question.topic_id', [$t[0]]);
            }
        }

        return $query;
    }
    public function scopeObjectives($query, $request)
    {

        if (!empty($request->config['objectives'])) {
            if ($request->config['objectives']) {
                $o = [];
                foreach ($request->config['objectives'] as $tp) {
                    array_push($o, $tp['value']);
                }
                $query->WhereIn('lms_question_objective.objective_id', [$o[0]]);
            }
        }

        return $query;
    }
}