<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactAddressRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'contact_id' => ['required', 'integer'],
            'address' => ['required', 'string'],
            'zip' => ['required', 'string'],
            'city' => ['required', 'string'],
            'address_category_id' => ['required', 'integer'],
            'country_id' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
