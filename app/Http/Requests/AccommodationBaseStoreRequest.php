<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class AccommodationBaseStoreRequest extends FormRequest
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
            'name' => ['required'],
            'type_id' => ['required', 'integer', 'exists:accommodation_types,id'],
            'street' => ['required'],
            'zip' => ['required'],
            'city' => ['required'],
            'country_id' => ['required'],
            'region_id' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'type_id.required' => 'Unterkunftsart ist ein Pflichtfeld.',
            'country_id.required' => 'Land ist ein Pflichtfeld.',
            'region_id.required' => 'Region ist ein Pflichtfeld.',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
