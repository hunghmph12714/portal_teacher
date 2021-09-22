<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    //
    public $table = 'budgets';
    protected $fillable = ['id', 'name', 'center_id', 'from', 'to', 'limit', 'status'];
    public function payments(){
        return $this->hasMany('App\Paper');
    }
    public function accounts(){
        return $this->belongsToMany('App\Account', 'budget_account', 'budget_id', 'account_id')
            ->withPivot('id','limit','actual');
    }
}
