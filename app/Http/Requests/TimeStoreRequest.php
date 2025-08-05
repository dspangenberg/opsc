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
            'name' => ['required'],
            'project_id' => ['required', 'exists:projects,id'],
            'category_id' => ['required', 'exists:time_categories,id'],
            'user_id' => ['required', 'exists:users,id'],
            'note' => ['nullable'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
