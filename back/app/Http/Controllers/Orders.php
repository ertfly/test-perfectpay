<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Routing\Controller as BaseController;

class Orders extends BaseController
{
    public function index(){
        
        throw new Exception('teste da hora');
        return [
            'response' => [
                'code' => 0,
                'msg' => null,
            ],
            'data' => [
                'teste' => 1,
            ]
        ];   
    }
    public function create(){
        
    }
}
