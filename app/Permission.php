<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use  Spatie\Permission\Models\Permission as BaseRole;
class Permission extends BaseRole {
    //
    public $table = 'permissions';
    protected $fillable = ['id', 'name', 'name_vn', 'subject','guard_name'];
}