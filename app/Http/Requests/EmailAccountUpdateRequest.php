<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmailAccountUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'email' => ['required', 'email', 'max:254'],
            'smtp_username' => ['required'],
            'smtp_password' => ['nullable'],
            'signature' => ['required'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
