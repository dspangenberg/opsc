<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookkeepingRuleUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'priority' => ['nullable', 'integer'],
            'table' => ['required', 'string'],
            'logical_operator' => ['required', 'string'],
            'is_active' => ['nullable', 'boolean'],


            // E-Mail-Validierung hinzufügen
            'conditions' => ['required', 'array'],
            'conditions.*.bookkeeping_rule_id' => ['nullable', 'integer'],
            'conditions.*.field' => ['required', 'string'],
            'conditions.*.logical_condition' => ['required', 'string'],
            'conditions.*.value' => ['required'],

            'actions' => ['required', 'array'],
            'actions.*.bookkeeping_rule_id' => ['nullable', 'integer'],
            'actions.*.field' => ['required', 'string'],
            'actions.*.value' => ['required'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
