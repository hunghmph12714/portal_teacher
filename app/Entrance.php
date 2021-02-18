<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Entrance extends Model
{
    //
    public $table = 'entrances';
    protected $fillable = ['student_id','course_id','center_id','test_time',
        'test_answers','test_score','test_note','note','priority','step_id','step_updated_at','status_id','message','source','source_id','medium_id'];
    protected $casts = ['message'=> 'array'];

    public function comments()    {
        return $this->hasMany('App\Comment');
    }
    
}
