<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceDetailsBaseUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'issued_on' => ['required', 'date', 'date_format:d.m.Y'],
            'service_period_begin' => ['nullable', 'date', 'date_format:d.m.Y'],
            'service_period_end' => [
                'nullable',
                'required_if:invoice,service_period_begin', 'date', 'date_format:d.m.Y',
                'after_or_equal:service_period_begin',
            ],
            'type_id' => ['required', 'exists:invoice_types,id'],
            'project_id' => ['nullable'],
            'tax_id' => ['required', 'exists:taxes,id'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
