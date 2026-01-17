<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'is_org' => ['required', 'boolean'],
            'salutation_id' => ['required_if:is_org,0'],
            'title_id' => 'nullable',
            'first_name' => ['nullable', 'string'],
            'position' => ['nullable', 'string'],
            'department' => ['nullable', 'string'],
            'name' => ['required', 'string'],

            'vat_id' => ['nullable', 'string'],
            'iban' => ['nullable', 'string'],
            'cc_name' => ['nullable', 'string'],
            'paypal_email' => ['nullable', 'string'],
            'register_court' => ['nullable', 'string'],
            'register_number' => ['nullable', 'string'],
            'outturn_account_id' => ['nullable', 'exists_if_not_empty:bookkeeping_accounts,account_number'],
            'cost_center_id' => ['nullable', 'exists_if_not_empty:cost_centers,id'],
            'is_primary' => ['nullable', 'boolean'],
            'dob' => ['nullable', 'date'],
            'note' => ['nullable', 'string'],

            // E-Mail-Validierung hinzufügen
            'mails' => ['nullable', 'array'],
            'mails.*.id' => ['nullable', 'integer'],
            'mails.*.email' => ['required', 'email', 'max:255'],
            'mails.*.email_category_id' => ['required', 'integer', 'exists:email_categories,id'],
            'mails.*.pos' => ['nullable', 'integer'],

            'addresses' => ['nullable', 'array'],
            'addresses.*.id' => ['nullable', 'integer'],
            'addresses.*.address' => ['required', 'string', 'max:255'],
            'addresses.*.zip' => ['required', 'string', 'max:255'],
            'addresses.*.city' => ['required', 'string', 'max:255'],
            'addresses.*.address_category_id' => ['required', 'integer', 'exists:address_categories,id'],
            'addresses.*.country_id' => ['required', 'integer', 'exists:countries,id'],

            'phones' => ['nullable', 'array'],
            'phones.*.id' => ['nullable', 'integer'],
            'phones.*.phone' => ['required', 'string', 'max:255'],
            'phones.*.phone_category_id' => ['required', 'integer', 'exists:phone_categories,id'],
            'phones.*.pos' => ['nullable', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
