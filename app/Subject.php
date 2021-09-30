<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    //
    public $table = 'lms_subjects';
    protected $fillable = ['id', 'chapter_id', 'title', 'description'];
    public function topics(){
        return $this->hasMany('App\Topic','subject_id','id');
    }
}
