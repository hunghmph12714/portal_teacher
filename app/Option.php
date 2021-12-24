<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    //
    public $table = 'lms_options';
    protected $fillable = ['question_id', 'content', 'weight', 'set', 'order'];
     
}
