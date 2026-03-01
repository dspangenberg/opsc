<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmailAccountStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'email' => ['required', 'email', 'max:254'],
            'smtp_username' => ['required'],
            'smtp_password' => ['required'],
            'signature' => ['required'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
