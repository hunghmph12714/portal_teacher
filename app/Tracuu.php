<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tracuu extends Model
{
    //
    public $table = 'tra_cuu';
    protected $fillable = ['sbd', 'ma_hs', 'result'];
}
