<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
class Transaction extends Model
{
    //
    public $table = 'transactions';
    protected $fillable = ['id','debit','credit','amount','time','content',
    'student_id','class_id','session_id','paper_id','status','user','center_id','refer_transaction','discount_id'
    ,'budget_id','created_at', 'updated_at', 'misa_upload', 'misa_upload_at', 'misa_id'];

    public function tags(){
        return $this->morphToMany('App\Tag', 'taggable');
    }
    public function students(){
        return $this->belongsTo('App\Student', 'student_id');
    }
    public function sessions(){
        return $this->belongsToMany('App\Session', 'transaction_session', 'transaction_id', 'session_id')
            ->withPivot('id','amount');
    }
    
}
