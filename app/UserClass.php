<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserClass extends Pivot
{
    //
    public $table = 'user_class';
    protected $fillable = ['user_id', 'class_id', 'manager'];
}
