<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Step extends Model
{
    //
    public $table = "steps";
    protected $fillable = ['id','name','order','duration','document','type','user_created'];

    public function entrances(){
        return $this->hasMany('App\Entrance');
    }
}
