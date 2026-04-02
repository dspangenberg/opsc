<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MailImportRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'contact_id' => ['required', 'exists:contacts,id'],
            'project_id' => ['nullable', 'exists_if_not_empty:projects,id'],
            'is_private' => ['required', 'boolean'],
            'use_attachments' => ['required', 'boolean'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
