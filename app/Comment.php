<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    //
    public $table = 'entrance_comments';
    protected $fillable = ['id','entrance_id','content','user_id','method','step_id'];
    
}
