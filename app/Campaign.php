<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    //
    public $table = 'campaigns';
    protected $fillable = ['id', 'name', 'from', 'to', 'user_id'];
    public function sources(){
        return $this->hasMany('App\Source');
    }
}
