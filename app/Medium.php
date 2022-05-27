<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Source;

class Medium extends Model
{
    //
    public $table = 'mediums';
    protected $fillable = ['id', 'source_id', 'name'];
    
    /**
     * Get the user that owns the Medium
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function source()
    {
        return $this->belongsTo(Source::class, 'source_id', 'id');
    }
}