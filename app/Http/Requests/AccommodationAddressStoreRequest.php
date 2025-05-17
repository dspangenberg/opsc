<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AccommodationAddressStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'street' => ['required'],
            'zip' => ['required'],
            'city' => ['required'],
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'region_id' => ['required', 'integer', 'exists:regions,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'country_id.exists' => 'Land ist ein Pfichtfeld.',
            'region_id.exists' => 'Region ist ein Pflichtfeld.',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
