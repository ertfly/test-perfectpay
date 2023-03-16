<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Order extends Authenticatable
{
    protected $fillable = [
        'name',
        'email',
        'total',
        'tid'
    ];
}
