<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ServiceCare extends Model
{
    //
    protected $table='service_cares';
    public $fillable=['service_id','care_id','content'];


    /**
     * Get the care that owns the ServiceCare
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function care()
    {
        return $this->belongsTo(Care::class);
    }
}
