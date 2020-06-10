<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Paper extends Model
{
    //
    public $table = "papers";
    protected $fillable = ['payment_number', 'receipt_number','type','name','description','amount'];
    public function transactions(){
        return $this->hasMany('App/Transaction', 'paper_id', 'id');
    }
}
