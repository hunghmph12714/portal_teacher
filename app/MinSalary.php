<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class MinSalary extends Model
{
    //
    public $table = 'min_salary';
    protected $fillable = ['domain','grade','level','salary'];
}
