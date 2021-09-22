<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TransactionSession extends Model
{
    //
    public $table = 'transaction_session';
    protected $fillable = ['id', 'transaction_id', 'session_id', 'amount'];
    
}
