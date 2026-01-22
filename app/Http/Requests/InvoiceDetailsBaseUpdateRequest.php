<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use App\Enums\InvoiceRecurringEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'is_recurring' => ['required', 'boolean'],
            'recurring_interval' => [
                'nullable',
                'required_if:is_recurring,true',
                'required_if:is_recurring,1',
                Rule::enum(InvoiceRecurringEnum::class),
            ],
            'recurring_interval_units' => ['required_with:is_recurring', 'integer', 'min:1'],
            'type_id' => ['required', 'exists:invoice_types,id'],
            'recurring_begin_on' => ['nullable', 'date', 'date_format:d.m.Y'],
            'recurring_end_on' => ['nullable', 'date', 'after:recurring_begin_on', 'date_format:d.m.Y'],
            'payment_deadline_id' => ['required', 'exists:payment_deadlines,id'],
            'project_id' => ['nullable'],
            'tax_id' => ['required', 'exists:taxes,id'],
            'parent_id' => ['nullable', 'exists:invoices,id'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
