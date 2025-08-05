<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TimeStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'project_id' => ['required', 'exists:projects,id'],
            'time_category_id' => ['required', 'exists:time_categories,id'],
            'user_id' => ['required', 'exists:users,id'],
            'note' => ['nullable'],
            'begin_at' => ['required', 'date', 'date_format:d.m.Y H:i'],
            'end_at' => [
                'nullable',
                'after_or_equal:begin_at',
                'date', 'date_format:d.m.Y H:i',
            ],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
