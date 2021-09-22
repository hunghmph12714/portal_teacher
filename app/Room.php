<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    //
    public $table = 'room';
    protected $fillable = ['id','name','center_id','status'];
}
