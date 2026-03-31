<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DropboxMailAttachmentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'dropbox_mail_id' => ['required', 'exists:dropbox_mails'],
            'mime_type' => ['required'],
            'filename' => ['required'],
            'size' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
