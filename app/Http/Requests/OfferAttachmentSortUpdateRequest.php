<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use App\Models\Offer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfferAttachmentSortUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'attachment_ids' => ['required', 'array'],
            'attachment_ids.*' => [
                'required',
                'numeric',
                Rule::exists('attachments', 'id')
                    ->where('attachable_type', Offer::class)
                    ->where('attachable_id', $this->route('offer')->id),
            ],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
