<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class OrderCreateRequest extends FormRequest
{
    public function rules()
    {
        if ($this->paymentMethodId != 'bolbradesco') {
            return [
                'name' => 'required|string',
                'email' => 'required|string|email',
                'total' => 'required|integer',
                'cardToken' => 'required|string',
                'paymentMethodId' => 'required|string',
                'issuerId' => 'required|string'
            ];
        }

        return [
            'name' => 'required|string',
            'email' => 'required|string|email',
            'total' => 'required|integer',
            'paymentMethodId' => 'required|string',
        ];


    }
}
