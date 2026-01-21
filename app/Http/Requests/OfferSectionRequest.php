<?php

namespace App\Http\Requests;

use App\Enums\PagebreakEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfferSectionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'default_content' => ['nullable'],
            'pagebreak' => ['nullable', Rule::enum(PagebreakEnum::class)],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
