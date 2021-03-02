<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Entrance extends Model
{
    //
    public $table = 'entrances';
    protected $fillable = ['student_id','course_id','center_id','test_time',
        'test_answers','test_score','test_note','note','priority','step_id','step_updated_at','status_id','message','source','source_id','medium_id','attempts'];
    protected $casts = ['message'=> 'array'];

    public function comments(){
        return $this->hasMany('App\Comment');
    }
    public function status(){
        return $this->belongsToMany('App\Status','entrance_status','entrance_id','status_id')->using('App\EntranceStatus')
            ->withPivot('user_id', 'comment', 'reason', 'active')
            ->withTimestamps();
    }
    
}
