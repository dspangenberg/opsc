<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterCredentialsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'password' => [
                'required', Password::min(12)->mixedCase()->numbers()->symbols()->uncompromised(), 'confirmed',
            ],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:tenants'],
            'hid' => ['required', 'string'],
            'domain' => [
                'required', 'string', 'unique:domains',
                'regex:/^(?:(?:\*|(?!-)(?:xn--)?[a-zA-Z0-9][a-zA-Z0-9-_]{0,61}[a-zA-Z0-9]{0,1}))$/i',
            ],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
