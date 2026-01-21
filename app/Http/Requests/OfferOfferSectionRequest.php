<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfferOfferSectionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'pos' => ['required', 'integer'],
            'title' => ['nullable'],
            'section_id' => ['required'],
            'content' => ['required', 'string'],
            'pagebreak' => ['nullable', 'boolean'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
