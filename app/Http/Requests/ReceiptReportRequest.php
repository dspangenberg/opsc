<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReceiptReportRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'begin_on' => ['required', 'date', 'date_format:Y-m-d'],
            'end_on' => [
                'required',
                'after_or_equal:begin_on',
                'date', 'date_format:Y-m-d',
            ],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
