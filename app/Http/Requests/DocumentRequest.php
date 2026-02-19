<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DocumentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'filename' => ['required', 'string'],
            'issued_on' => ['nullable', 'date_format:d.m.Y'],
            'received_on' => ['nullable', 'date_format:d.m.Y'],
            'sent_on' => ['nullable', 'date_format:d.m.Y'],
            'title' => ['required', 'string'],
            'summary' => ['nullable', 'string'],
            'is_inbound' => ['required', 'boolean'],
            'sender_contact_id' => ['nullable', 'exists:contacts,id'],
            'receiver_contact_id' => ['nullable', 'exists:contacts,id'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'document_type_id' => ['required', 'exists:document_types,id'],
        ];
    }
}
