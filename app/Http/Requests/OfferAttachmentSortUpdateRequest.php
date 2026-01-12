<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfferAttachmentSortUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'attachment_ids' => ['required', 'array'],
            'attachment_ids.*' => ['required', 'numeric', 'exists:attachments,id'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
