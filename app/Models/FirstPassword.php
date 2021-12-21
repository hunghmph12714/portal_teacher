<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FirstPassword extends Model
{
    protected $table = 'first_passwords';
    public $fillable = ['teacher_id', 'password'];
    use HasFactory;
}