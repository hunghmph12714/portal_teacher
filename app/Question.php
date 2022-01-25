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



    public function scopeDomain($query, $arr_domain)
    {
        if (!empty($arr_domain)) {

            if ($arr_domain) {
                // dd('%' . $domain . '%');
                $query->whereIn('domain',   $arr_domain);
            }
        }
        // dd($query);
        return $query;
    }

    public function scopeQuestionLevel($query, $arr_lever)
    {
        if (!empty($arr_lever)) {
            if ($arr_lever) {
                $querywhereIn('question_level',   $arr_lever);
            }
        }
        return $query;
    }
    public function scopeGrade($query, $arr_grade)
    {
        if (!empty($arr_grade)) {
            if ($arr_grade) {
                $query->whereIn('grade',  $arr_grade);
            }
        }

        return $query;
    }
    public function scopeQuestion_type($query, $arr_loai)
    {
        if (!empty($arr_loai)) {
            if ($arr_loai) {
                $query->whereIn('question_type',  $arr_loai);
            }
        }

        return $query;
    }

    // public function scopeTopics($query, $request)
    // {
    //     if (!empty($request->config['topics'])) {


    //         if ($request->config['topics']) {
    //             $t = [];
    //             foreach ($request->config['topics'] as $tp) {
    //                 array_push($t, $tp['value']);
    //             }
    //             $query->WhereIn('lms_topics.id', [$t]);
    //         }
    //     }

    //     return $query;
    // }
    // public function scopeObjectives($query, $request)
    // {

    //     if (!empty($request->config['objectives'])) {
    //         if ($request->config['objectives']) {
    //             $o = [];
    //             foreach ($request->config['objectives'] as $tp) {
    //                 array_push($o, $tp['value']);
    //             }
    //             $query->WhereIn('objectives.id', [$o]);
    //         }
    //     }

    //     return $query;
    // }
}