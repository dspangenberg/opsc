<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TodoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'todoable_type' => 'required|string',
            'todoable_id' => 'required|integer',
            'assigned_to_user_id' => ['required', 'exists:users,id'],
            'due_at' => ['nullable', 'date', 'date_format:d.m.Y H:i'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
