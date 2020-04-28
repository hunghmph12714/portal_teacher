<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
class StudentSession extends Pivot
{
    //
    public $table = 'student_session';
    protected $fillable = ['student_id','session_id','attendance','type','score','note','attendance_note'];
    public $incrementing = true;
}
