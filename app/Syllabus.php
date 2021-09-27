<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Syllabus extends Model
{
    //
    public $table = 'syllabus';
    protected $fillable = ['id', 'title', 'grade', 'subject', 'description', 'public'];
    public function chapters(){
        $this->hasMany('App\Chapter', 'syllabus_id', 'id');
    }
}
