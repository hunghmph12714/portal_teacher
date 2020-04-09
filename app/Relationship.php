<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Relationship extends Model
{
    //
    public $table = "relationships";
    protected $fillable = ['id','name','count','color'];
    public function parents(){
        return $this->hasMany('App\Parents');
    }
}
