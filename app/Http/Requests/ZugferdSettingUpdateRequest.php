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
            'global_id_type' => ['nullable', 'string'],
            'global_id' => ['nullable', 'string'],
        ];
    }
}
