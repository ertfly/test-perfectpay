<?php

namespace App\Http\Services;

class MercadoPagoService
{
    public function __construct()
    {
        \MercadoPago\SDK::setAccessToken(env('MERCADOPAGO_ACCESS_TOKEN'));
    }

    /**
     * Undocumented function
     *
     * @param string $email
     * @return \MercadoPago\Customer
     */
    public function createOrUpdateCustomer($firstname, $lastname, $email)
    {
        $filters = [
            'email' => $email
        ];
        $customers = \MercadoPago\Customer::search($filters);

        $id = null;
        $update = false;
        foreach ($customers as $c) {
            $id = $c->id;
            if ($c->first_name != $firstname || $c->last_name != $lastname) {
                $update = true;
            }
        }

        $customer = null;
        if ($id) {
            $customer = \MercadoPago\Customer::find_by_id($id);
        } else {
            $customer = new \MercadoPago\Customer();
        }

        if (!$id || ($id && $update)) {
            $customer->first_name = $firstname;
            $customer->last_name = $lastname;
            $customer->email = $email;
        }

        if ($id) {
            if ($update) {
                $customer->update();
            }
        } else {
            $customer->save();
        }

        return \MercadoPago\Customer::find_by_id($customer->id);
    }
}
