<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Schools extends Model
{
    //
    public $table = 'schools';
    protected $fillable = ['type','name'];
    public $timestamps = false;
}
