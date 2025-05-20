<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceLineUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'pos' => ['required', 'int'],
            'quantity' => ['required', 'numeric'],
            'price' => ['required', 'numeric'],
            'invoice_id' => ['required', 'exists:invoices,id'],
            'amount' => ['required', 'numeric'],
            'text' => ['required', 'string'],
            'unit' => ['required', 'string'],
            'service_period_begin' => ['nullable', 'date', 'date_format:d.m.Y'],
            'service_period_end' => [
                'nullable',
                'required_if:invoice_lines,service_period_begin', 'date', 'date_format:d.m.Y',
                'after_or_equal:service_period_begin',
            ],
            'type_id' => ['required', 'int'],
            'tax_rate_id' => ['required', 'exists:tax_rates,id'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
