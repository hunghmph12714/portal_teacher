<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class EntranceStat extends Model
{
    //
    public $table = "entrance_stats";
    protected $fillable = [
        'date', 'center_id',
        'init_remain', 'init_today', 'init_completed', 'init_total', 'init_1', 'init_2', 'init_3',
        'appointment_remain', 'appointment_today', 'appointment_completed', 'appointment_total', 'appointment_1', 'appointment_2', 'appointment_3',
        'result_remain', 'result_today', 'result_completed', 'result_total', 'result_1', 'result_2', 'result_3',
        'inform_remain', 'inform_today', 'inform_completed', 'inform_total', 'inform_1', 'inform_2', 'inform_3','inform_4',
        'final_remain', 'final_today', 'final_completed', 'final_total', 'final_1', 'final_2', 'final_3',
    ];
    
}
