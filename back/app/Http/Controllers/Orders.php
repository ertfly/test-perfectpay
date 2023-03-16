<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;

class Orders extends BaseController
{
    public function index(){
        return [
            'teste' => 1,
        ];   
    }
    public function create(){

    }
}
