<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmailAttachmentRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email_id' => ['required', 'exists:emails'],
            'filename' => ['required'],
            'mime_type' => ['required'],
            'size_in_bytes' => ['required'],
            'storage_path' => ['required'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
