<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DropboxMailLinkRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'link_type' => ['required'],
            'link_id' => ['required', 'integer'],
            'dropbox_mail_id' => ['required', 'exists:dropbox_mails'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
