<?php
/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'last_name' => ['required'],
            'first_name' => ['required'],
            'organisation' => ['nullable'],
            'website' => ['required', 'string', 'url:https'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:tenants'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
