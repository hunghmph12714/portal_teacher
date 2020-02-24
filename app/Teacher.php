<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    //
    public $table = 'teacher';
    protected $fillable = ['id' ,'name', 'email', 'phone', 'school', 'address','domain'];
    
}
