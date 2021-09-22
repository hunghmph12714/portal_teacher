<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MathDoc extends Model
{
    public $table = "maths";
    protected $fillable = ['major','topic','level','type','question','mc','answer','custom_field','tag','grade','user_id','status'];
}
