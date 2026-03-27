<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DropboxMailRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'message_id' => ['required'],
            'subject' => ['required'],
            'text' => ['required'],
            'references' => ['required'],
            'from' => ['required'],
            'to' => ['required'],
            'html' => ['required'],
            'dropbox_id' => ['required', 'exists:dropboxes'],
            'timestamp' => ['required', 'date'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
