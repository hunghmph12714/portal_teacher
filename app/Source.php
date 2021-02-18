<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Source extends Model
{
    //
    public $table = 'sources';
    protected $fillable = ['id', 'name', 'campaign_id'];

    public function mediums(){
        return $this->hasMany('App\Medium');
    }
}
