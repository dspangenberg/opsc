<?php
/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalendarRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'icon' => ['required'],
            'color' => ['required'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
