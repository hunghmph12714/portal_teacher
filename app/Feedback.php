<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model

{
    protected $table = 'feedbacks';
    public $fillable = ['title', 'description', 'upload', 'user_id', 'result', 'status', 'feedack_id', 'phone'];

    /**
     * Get the user that owns the Feedback
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }


    protected $casts = [
        'upload' => 'array',
    ];
}
