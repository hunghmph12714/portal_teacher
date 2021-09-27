<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Topic extends Model
{
    //
    public $table = 'topics';
    protected $fillable = ['id', 'subject_id', 'title', 'content'];
    
}
