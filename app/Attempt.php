<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Attempt extends Model
{
    //
    protected $fillable = ['id', 'quiz_id', 'start_time', 'student_session','parent_id', 'student_id', 'upload', 'score_domain_1', 'score_domain_2', 'score_domain_3'];
    public $table = 'lms_attempts';
    protected $casts = ['upload' => 'array'];



    /**
     * Get all of the comments for the Attempt
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function attempt_detail()
    {
        return $this->hasMany(AttemptDetail::class, 'attempt_id');
    }
    /**
     * Get the question associated with the Attempt
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */


    /**
     * Get all of the criteria for the Attempt
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function criteria()
    {
        return $this->hasMany(Criteria::class, 'attempt_id');
    }
}
