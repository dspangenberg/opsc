<?php
/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaxRateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'tax_id' => ['required', 'exists:taxes'],
            'rate' => ['required', 'numeric'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
