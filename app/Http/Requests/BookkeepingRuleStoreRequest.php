<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookkeepingRuleStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'priority' => ['nullable', 'integer'],
            'table' => ['required', 'string'],
            'logical_operator' => ['required', 'string'],
            'amount_type' => ['required_if:table,transactions', 'string'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
