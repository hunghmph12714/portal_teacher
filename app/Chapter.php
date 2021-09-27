<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Chapter extends Model
{
    //
    public $table = 'chapters';
    protected $fillable = ['id', 'syllabus_id', 'title', 'description'];
    public function subjects(){
        $this->hasMany('App\Subject', 'chapter_id', 'id');
    }
}
