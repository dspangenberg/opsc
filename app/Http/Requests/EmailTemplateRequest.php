<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmailTemplateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'subject' => ['required'],
            'body' => ['required'],
            'email_account_id' => ['nullable', 'exists:email_accounts'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
