<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Routing\Controllers\Middleware;

class Api 
{
    public function handle($request, Closure $next)
    {
        try {
            return $next($request);
        }catch(Exception $e){
            return [
                'response' => [
                    'code' => 1,
                    'msg' => $e->getMessage(),
                ]
            ];
        }
        
    }
}
