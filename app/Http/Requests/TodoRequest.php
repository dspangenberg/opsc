<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TodoRequest extends FormRequest
{
    private const SUPPORTED_TYPES = [
        'App\Models\Project',
        'App\Models\Contact',
        'App\Models\Document',
    ];

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'todoable_type' => ['required', Rule::in(self::SUPPORTED_TYPES)],
            'todoable_id' => ['required', 'integer'],
            'assigned_to_user_id' => ['nullable', 'exists:users,id'],
            'due_at' => ['nullable', 'date_format:d.m.Y H:i'],
        ];
    }
}
