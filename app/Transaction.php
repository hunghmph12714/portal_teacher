<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    //
    public $table = 'transactions';
    protected $fillable = ['id','debit','credit','amount','time','content',
    'student_id','class_id','session_id','paper_id','status','user'];
    
}
