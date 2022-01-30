<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    //
    public $table = 'lms_chapters';
    protected $fillable = ['syllabus_id', 'title', 'description'];
    public function subjects(){
        return $this->hasMany('App\Subject', 'chapter_id', 'id');
    }
}
