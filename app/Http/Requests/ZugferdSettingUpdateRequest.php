<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ZugferdSettingUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'seller_contact_id' => ['required', 'numeric', 'exists:contacts,id'],
            'seller_contact_person_id' => ['required', 'numeric', 'exists:contacts,id'],
            'seller_contact_address_id' => ['required', 'numeric', 'exists:contact_addresses,id'],
            'document_note' => ['nullable', 'string'],
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
