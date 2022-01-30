<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class QuestionObjective extends Pivot
{
    //
    public $table = 'lms_question_objective';
    protected $fillable = ['question_id', 'objective_id'];

    public function scopeQuestionLevel($query, $question_level)
    {
        if ($question_level) {
            $query->where('question_level', $question_level);
        }

        return $query;
    }

    public function scopeTopics($query, $arr_topic)
    {
        if ($arr_topic)
            $query->WhereIn('topic_id', $arr_topic);
        return $query;
    }
    public function scopeDomain($query, $domain)
    {
        if ($domain) {
            $query->where('domain', 'like', $domain);
        }
        return $query;
    }
}
