<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class StudentClass extends Pivot
{
    //
    public $table = 'student_class';
    protected $fillable = ['student_id','class_id','entrance_date','status','stats','drop_time','updated_at','created_at','retain_time','transfer_date'];
    protected $casts = ['stats'=>'array'];
    public $incrementing = true;
    public $timestamps = true;
    public function discounts(){
        return $this->hasMany('App\Discount');
    }
}
