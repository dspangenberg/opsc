<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceLinesUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'lines' => ['required', 'array'],
            'lines.*.id' => ['required', 'int'],
            'lines.*.pos' => ['required', 'int'],
            'lines.*.quantity' => ['required', 'numeric'],
            'lines.*.price' => ['required', 'numeric'],
            'lines.*.amount' => ['required', 'numeric'],
            'lines.*.text' => ['required', 'string'],
            'lines.*.unit' => ['required', 'string'],
            'lines.*.service_period_begin' => ['nullable', 'date'],
            'lines.*.service_period_end' => [
                'nullable',
                'date',
                'after_or_equal:lines.*.service_period_begin',
            ],
            'lines.*.type_id' => ['required', 'int'],
            'lines.*.tax_rate_id' => ['required', 'exists:tax_rates,id'],
        ];
    }
}
