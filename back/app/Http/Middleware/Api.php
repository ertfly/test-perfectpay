<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Routing\Controllers\Middleware;

class Api 
{
    public function handle($request, Closure $next)
    {
        return $next($request);
    }
}
