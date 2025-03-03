<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InboxRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'email_address' => ['nullable'],
            'name' => ['required'],
            'is_default' => ['required'],
            'allowed_senders' => ['nullable'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
