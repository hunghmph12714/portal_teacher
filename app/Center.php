<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Center extends Model
{
    //
    protected $fillable = ['id','name','address','phone','email','code',];
    public $table = 'center';

    
    public function entrances(){
        return $this->hasMany('App\Entrance');
    }
    public function classes(){
        return $this->hasMany('App\Classes');
    }
}
