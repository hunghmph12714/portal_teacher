<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Criteria extends Model
{
    protected $table = 'lms_criterias';
    public $filable = ['attempt_id', 'domain', 'content', 'title'];
}