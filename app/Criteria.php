<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    public $table = 'lms_criterias';
    protected $fillable = ['attempt_id', 'domain', 'content', 'title'];
}