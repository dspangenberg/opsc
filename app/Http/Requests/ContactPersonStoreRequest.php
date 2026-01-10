<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactPersonStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'salutation_id' => ['required_if:is_org,0'],
            'title_id' => 'nullable',
            'first_name' => ['nullable', 'string'],
            'name' => ['required', 'string'],
            'company_id' => 'required|exists:contacts,id',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
