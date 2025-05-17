<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class AccommodationStoreRequest extends FormRequest
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
            'phone' => ['required'],
            'website' => ['required', 'string', 'url:https'],
            'email' => ['nullable', 'lowercase', 'email', 'max:255'],
            'place_id' => ['required', 'string'],
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
        ];
    }

    public function messages(): array
    {
        return [
            'type_id.required' => 'Unterkunftsart ist ein Pfichtfeld.',
            'region_id.exists' => 'Region ist ein Pflichtfeld.',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
