<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Medium extends Model
{
    //
    public $table = 'mediums';
    protected $fillable = ['id', 'source_id', 'name'];
}
