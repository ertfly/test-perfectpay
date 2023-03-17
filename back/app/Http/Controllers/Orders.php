<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderCreateRequest;
use Illuminate\Routing\Controller as BaseController;

class Orders extends BaseController
{
    public function index()
    {
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
    public function create(OrderCreateRequest $request)
    {
        \MercadoPago\SDK::setAccessToken("TEST-4419922878215203-082012-36ec5caa5e9cbabe09114a78cd8fccda-343999868");

        $payment = new \MercadoPago\Payment();

        $name = $request->get('name');
        $name = explode(' ', $name);

        $payment->transaction_amount = intval($request->get('total'))/100;
        $payment->token = $request->get('cardToken');
        $payment->description = "Teste PerfectPay";
        $payment->installments = 1;
        $payment->payment_method_id = $request->get('paymentMethodId');
        $payment->payer = array(
            "first_name" => $name[0] ?? null,
            "last_name" => $name[1] ?? null,
            "email" => $request->get('email'),
        );
        $payment->capture = true;
        $payment->save();

        return [
            'response' => [
                'code' => 0,
                'msg' => null,
            ],
            'data' => $payment->toArray()
        ];
    }
}
