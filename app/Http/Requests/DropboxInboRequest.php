<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DropboxInboRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'message_id' => ['required'],
            'payload' => ['required'],
            'dropbox_id' => ['required', 'exists:dropboxes'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
