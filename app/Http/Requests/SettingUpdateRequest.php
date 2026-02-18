<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SettingUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'group' => ['required', 'string', 'in:general,zugferd'],
            'key' => ['required', 'string'],
            'value' => ['nullable'],
        ];
    }

    public function messages(): array
    {
        return [
            'group.required' => 'Die Einstellungsgruppe ist erforderlich.',
            'group.in' => 'Die Einstellungsgruppe ist ungültig.',
            'key.required' => 'Der Einstellungsschlüssel ist erforderlich.',
        ];
    }
}
