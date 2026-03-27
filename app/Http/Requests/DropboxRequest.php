<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DropboxRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email_address' => ['required', 'email', 'unique:dropboxes,email_address,'.($this->route('dropbox')?->id ?? 'NULL')],
            'token' => ['required', 'string'],
            'name' => ['required'],
            'is_shared' => ['boolean'],
            'is_auto_processing' => ['boolean'],
            'is_private_by_default' => ['boolean'],
            'user_id' => ['nullable', 'exists:users,id'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
