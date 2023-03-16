<?php

namespace App\Http\Controllers;

use App\Http\Services\MercadoPagoService;
use Exception;
use Illuminate\Routing\Controller as BaseController;

class Orders extends BaseController
{
    public function index()
    {

        $mercadoPagoService = new MercadoPagoService();
        $customer = $mercadoPagoService->createOrUpdateCustomer('Eric', 'Rozetti Teixeira', 'contato@ericteixeira.com.br');

        echo '<pre>';
        var_dump($customer);
        exit;

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
    public function create()
    {
    }
}
