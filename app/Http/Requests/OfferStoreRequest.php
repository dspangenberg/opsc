<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfferStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'issued_on' => ['required', 'date', 'date_format:d.m.Y'],
            'contact_id' => ['required', 'exists:contacts,id'],
            'project_id' => ['nullable', 'exists_if_not_empty:projects,id'],
            'tax_id' => ['required', 'exists:taxes,id'],
            'is_draft' => ['nullable', 'boolean'],
            'template_id' => ['nullable', 'exists_if_not_empty:offers,id'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
