<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
class StudentSession extends Pivot
{
    //
    public $table = 'student_session';
    protected $fillable = ['student_id','session_id','attendance','type','score','note','attendance_note','logs','max_score','btvn_score','btvn_max','btvn_complete','comment','btvn_comment','checked', 'upload_exercice'];
    protected $casts = ['logs' => 'array'];
    public $incrementing = true;
}
