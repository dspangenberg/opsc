<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfferSectionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'title' => ['nullable'],
            'is_required' => ['boolean'],
            'pos' => ['required', 'integer'],
            'default_content' => ['nullable'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
