<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfferTemplateStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'id' => ['required', 'exists:offers,id'],
            'template_name' => ['required', 'string']
        ];
    }

    public function messages(): array
    {
        return [
            'template_name.required' => 'Bitte einen Vorlagennamen angeben.',
            'template_name.string' => 'Der Vorlagenname muss ein Text sein.',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
