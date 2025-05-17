<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class AccommodationContactStoreRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'website' => Str::trim(Str::replace('http://', 'https://', $this->website), '/'),
        ]);
    }

    public function rules(): array
    {
        return [
            'phone' => ['required'],
            'website' => ['required', 'string', 'url:https'],
            'email' => ['nullable', 'lowercase', 'email', 'max:255'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
