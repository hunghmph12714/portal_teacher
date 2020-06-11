<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    //
    public $table = "tags";
    protected $fillable = ['id','name','created_at','updated_at'];
    public function transactions(){
        return $this->morphedByMany('App\Transaction', 'taggable');
    }
}
