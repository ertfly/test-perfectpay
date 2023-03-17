<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderCreateRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|string',
            'email' => 'required|string|email',
            'total' => 'required|integer',
            'cardToken' => 'required|string',
            'paymentMethodId' => 'required|string',
            'issuerId' => 'required|string'
        ];
    }
}
