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

<<<<<<< HEAD


    public function scopeDomain($query, $request)
=======
    public function scopeDomain($query, $arr_domain)
>>>>>>> 62a5a3320a50865995bdcf0084470d1f33d012bd
    {
        if (!empty($request->config['domain'])) {

<<<<<<< HEAD
            if ($request->config['domain']['value']) {
                $query->where('domain', 'like', '%' . $request->config['domain']['value'] . '%');
            }
        }

        return $query;
    }

    public function scopeQuestionLevel($query, $request)
=======
            if ($arr_domain) {
                $query->whereIn('domain',    $arr_domain);
            }
        }
        return $query;
    }
    public function scopeQuestionLevel($query, $arr_lever)
>>>>>>> 62a5a3320a50865995bdcf0084470d1f33d012bd
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
<<<<<<< HEAD
        if (!empty($request->config['grade'])) {
            if ($request->config['grade']['value']) {
                $query->where('lms_questions.grade',  $request->config['grade']['value']);
=======
        if (!empty($arr_grade)) {
            if ($arr_grade) {
                $query->whereIn('lms_questions.grade',  $arr_grade);
>>>>>>> 62a5a3320a50865995bdcf0084470d1f33d012bd
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 62a5a3320a50865995bdcf0084470d1f33d012bd
