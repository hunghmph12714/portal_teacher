<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class QuizConfigTopic extends Pivot
{
    //
    public $table = 'lms_quiz_config_topic';
    protected $fillable = ['quiz_config_id', 'topic_id', 'subject', 'question_type', 'question_level', 'quantity', 'score'];

    // public function scopeToan($query, $cf_toan)
    // {
    //     if (!empty($cf_toan)) {
    //         if ($cf_toan) {
    //             $query->where('lms_questions.grade',  $cf_toan['value']);
    //         }
    //     }

    //     return $query;
    // }
}
