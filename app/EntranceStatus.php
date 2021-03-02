<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class EntranceStatus extends Pivot
{
    //
    protected $fillable = ['id', 'entrance_id', 'status_id', 'user_id', 'active', 'comment', 'reason'];
    public $table = 'entrance_status';
    
}
