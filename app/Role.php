<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use  Spatie\Permission\Models\Role as BaseRole;

class Role extends BaseRole
{
    //
    public $table = 'roles';
    protected $fillable = ['id', 'department', 'name', 'note', 'guard_name'];


    public function user()
    {
        return $this->morphMany(User::class, 'model');
    }
}