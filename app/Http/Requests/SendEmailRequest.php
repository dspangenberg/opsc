<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendEmailRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'subject' => ['required'],
            'body' => ['required'],
            'city' => ['required'],
            'name' => ['required'],
            'email' => ['required', 'email'],
            'email_account_id' => ['required', 'exists:email_accounts,id'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
