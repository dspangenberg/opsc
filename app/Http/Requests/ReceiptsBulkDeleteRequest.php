<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReceiptsBulkDeleteRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ids' => ['required', 'string', 'regex:/^[0-9]+(,[0-9]+)*$/'],
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
            'ids.required' => 'Es müssen Belege ausgewählt werden.',
            'ids.regex' => 'Das Format Belege Buchungs-IDs ist ungültig.',
        ];
    }

    /**
     * Get the booking IDs as an array of integers.
     *
     * @return array<int>
     */
    public function getReceiptIds(): array
    {
        $ids = explode(',', $this->input('ids', ''));

        return array_values(array_filter(array_map('intval', $ids), fn ($id) => $id > 0));
    }
}
