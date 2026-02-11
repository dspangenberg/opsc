<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceStoreExternalRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'issued_on' => ['required', 'date', 'date_format:d.m.Y'],
            'service_period_begin' => ['nullable', 'date', 'date_format:d.m.Y'],
            'service_period_end' => [
                'nullable',
                'required_with:service_period_begin',
                'date',
                'date_format:d.m.Y',
                'after_or_equal:service_period_begin',
            ],
            'invoice_number' => ['required', 'integer', 'unique:invoices,invoice_number'],
            'amount' => ['required', 'numeric', 'gt:0'],
            'tax_id' => ['required', 'exists:taxes,id'],
            'payment_deadline_id' => ['required', 'exists:payment_deadlines,id'],
            'document_id' => ['required', 'exists:documents,id'],
            'contact_id' => ['required', 'exists:contacts,id'],
            'project_id' => ['nullable', 'exists_if_not_empty:projects,id'],
            'is_external' => ['required', 'boolean']
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
