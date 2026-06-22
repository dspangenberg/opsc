<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class LetterCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date', 'date_format:d.m.Y'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'signature_left_user_id' => ['required', 'exists:users,id'],
            'signature_right_user_id' => ['nullable', 'exists_if_not_empty:users,id'],
            'template_id' => ['required', 'integer', 'exists:office_templates,id'],
            'recipient_id' => ['required', 'integer', 'exists:contacts,id'],
            'recipient_contact_id' => ['nullable', 'exists_if_not_empty:contacts,id'],
            'salutation' => ['required', 'string'],
            'subject' => ['required', 'string'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ids.required' => 'Es müssen Dokumente ausgewählt werden.',
            'ids.regex' => 'Das Format der Dokument-Ids ist ungültig.',
        ];
    }

    /**
     * Get the document IDs as an array of integers.
     *
     * @return array<int>
     */
    public function getDocumentIds(): array
    {
        $ids = explode(',', $this->input('ids', ''));

        return array_values(array_filter(array_map('intval', $ids), fn ($id) => $id > 0));
    }
}
