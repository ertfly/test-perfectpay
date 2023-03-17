<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderCreateRequest;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;

class Orders extends BaseController
{
    public function index()
    {
        \MercadoPago\SDK::setAccessToken("TEST-4419922878215203-082012-36ec5caa5e9cbabe09114a78cd8fccda-343999868");

        $payment = new \MercadoPago\Payment();
        $payment->transaction_amount = 100;
        $payment->description = "Título do produto";
        $payment->payment_method_id = "bolbradesco";
        $payment->payer = array(
            "email" => "test@test.com",
            "first_name" => "Test",
            "last_name" => "User",
            "identification" => array(
                "type" => "CPF",
                "number" => "19119119100"
            ),
            "address" =>  array(
                "zip_code" => "06233200",
                "street_name" => "Av. das Nações Unidas",
                "street_number" => "3003",
                "neighborhood" => "Bonfim",
                "city" => "Osasco",
                "federal_unit" => "SP"
            )
        );

        $payment->save();

        echo '<pre>';
        var_dump($payment);
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
    public function create(OrderCreateRequest $request)
    {
        \MercadoPago\SDK::setAccessToken("TEST-4419922878215203-082012-36ec5caa5e9cbabe09114a78cd8fccda-343999868");

        $payment = new \MercadoPago\Payment();

        $name = $request->get('name');
        $name = explode(' ', $name);

        $payer = [
            "first_name" => $name[0] ?? null,
            "last_name" => $name[1] ?? null,
            "email" => $request->get('email'),
        ];
        if ($request->get('paymentMethodId') != 'bolbradesco') {
            $payment->token = $request->get('cardToken');
            $payment->installments = 1;
            $payment->capture = true;
            Log::debug(json_encode($payer));
        } else {
            $payer = array_merge($payer, [
                "identification" => array(
                    "type" => "CPF",
                    "number" => $request->get('invoiceDocument')
                ),
                "address" =>  array(
                    "zip_code" => $request->get('invoiceZipcode'),
                    "street_name" => $request->get('invoiceStreetName'),
                    "street_number" => $request->get('invoiceStreetNumber'),
                    "neighborhood" => $request->get('invoiceNeighborhood'),
                    "city" => $request->get('invoiceCity'),
                    "federal_unit" => $request->get('invoiceFederalUnit')
                )
            ]);
            Log::debug(json_encode($payer));
        }

        

        $payment->transaction_amount = intval($request->get('total')) / 100;
        $payment->description = "Teste PerfectPay";
        $payment->payment_method_id = $request->get('paymentMethodId');
        $payment->payer = $payer;
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
