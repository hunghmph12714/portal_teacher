<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CareService extends Model
{
    protected $table="care_service";
    public $fillable=['service_id','care_id','content'];
    public function care()
    {
        return $this->belongsTo(Care::class);
    }
    /**
     * Get the service associated with the CareService
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function service()
    {
        return $this->hasOne(Service::class, 'id', 'service_id');
    }
}
