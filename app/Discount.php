<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    //
    public $table = 'discounts';
    protected $fillable = ['id','student_class_id','active_at','expired_at','percentage','amount','max_use','status'];
}
