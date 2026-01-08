<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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

    /**
     * Get the validated data from the request.
     * Additional sanitization is handled by the md() helper which uses
     * league/commonmark with HTML stripping to prevent XSS.
     */
    public function validated($key = null, $default = null): array
    {
        $validated = parent::validated($key, $default);

        // Additional text is sanitized when rendered via md() helper
        // No pre-storage sanitization needed as markdown is safe to store

        return $validated;
    }
}
