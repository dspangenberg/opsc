<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmailRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'message_id' => ['required'],
            'subject' => ['required'],
            'body_plain' => ['nullable'],
            'body_html' => ['nullable'],
            'from_email' => ['required', 'email', 'max:254'],
            'from_name' => ['nullable'],
            'to' => ['required'],
            'cc' => ['nullable'],
            'bcc' => ['nullable'],
            'date_sent' => ['required', 'date'],
            'date_received' => ['required', 'date'],
            'has_attachments' => ['boolean'],
            'imap_folder' => ['required'],
            'size_in_bytes' => ['required'],
            'headers' => ['nullable'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
