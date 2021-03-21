<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class BudgetAccount extends Pivot
{
    //
    public $table = 'budget_account';
    protected $fillable = ['budget_id','account_id','limit','actual'];
    public $incrementing = true;
}
