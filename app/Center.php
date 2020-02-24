<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Center extends Model
{
    //
    protected $fillable = ['id','name','address','phone','email'];
    public $table = 'center';
}
