<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DropboxMailSnoozeRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'snoozed_until' => ['required', 'date', 'date_format:d.m.Y H:i'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
