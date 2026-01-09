<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Request validation for offer terms.
 *
 * Security Note:
 * The additional_text field stores raw markdown which is sanitized when rendered
 * via the md() helper function. The md() helper uses league/commonmark with
 * HTMLPurifier to prevent XSS attacks while allowing safe HTML tags like
 * tables, line breaks, and basic formatting.
 */
class OfferTermsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'additional_text' => ['required', 'string', 'max:65535'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
