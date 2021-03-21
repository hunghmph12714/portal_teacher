<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    //
    public $table = 'accounts';
    protected $fillable = ['id','level_1','level_2','name','description','balance','type'];
    public $timestamps = false;
    public function budgets(){
        return $this->belongsToMany('App\Budget', 'budget_account', 'account_id', 'budget_id')
            ->withPivot('id','limit','actual');
    }
}
