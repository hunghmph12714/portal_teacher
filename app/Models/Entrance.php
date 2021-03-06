<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Medium;
use App\Center;

class Entrance extends Model
{
    //
    public $table = 'entrances';
    protected $fillable = ['student_id','course_id','center_id','test_time','class_id',
        'test_answers','test_score','test_note','test_results','note','priority','step_id','step_updated_at','status_id','message','source','source_id','medium_id','attempts'];
    protected $casts = ['message'=> 'array'];

    public function comments(){
        return $this->hasMany('App\Comment');
    }
    public function status(){
        return $this->belongsToMany('App\Status','entrance_status','entrance_id','status_id')->using('App\EntranceStatus')
            ->withPivot('user_id', 'comment', 'reason', 'active')
            ->withTimestamps();
    }
    /**
     * Get the user associated with the Entrance
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function medium()
    {
        return $this->hasOne(Medium::class, 'id','medium_id');
    } 
    /**
     * Get the center that owns the Entrance
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function center()
    {
        return $this->belongsTo(Center::class, 'center_id', 'id');
    }

         
    // public function source()
    // {
    //     return $this->belongsToMany(Scource::class, 'mediums', 'scource', 'id');
    // }
    
}