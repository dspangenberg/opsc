<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookingPolicyRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'is_default' => ['boolean'],
            'age_min' => ['required', 'integer'],
            'arrival_days' => ['required'],
            'departure_days' => ['required'],
            'stay_min' => ['required', 'integer'],
            'stay_max' => ['required', 'integer'],
            'checkin' => ['required', 'integer'],
            'checkout' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
