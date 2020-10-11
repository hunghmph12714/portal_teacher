<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Parents extends Model
{
    //
    public $table = 'parents';
    protected $fillable = ['id','fullname','relationship_id','phone','email','note','alt_fullname','alt_phone','alt_email'];
    public function students(){
        return $this->hasMany('App\Student', 'parent_id');
    }

}
