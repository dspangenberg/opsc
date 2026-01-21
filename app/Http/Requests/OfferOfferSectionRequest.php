<?php

namespace App\Http\Requests;

use App\Enums\PagebreakEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfferOfferSectionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'content' => ['required', 'string'],
            'pagebreak' => ['nullable', Rule::enum(PagebreakEnum::class)],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
