<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CorrectEditBookingsRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'account_id_credit' => ['required', 'exists:bookkeeping_accounts,account_number'],
            'account_id_debit' => ['required', 'exists:bookkeeping_accounts,account_number'],
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
            'ids.required' => 'Es müssen Buchungen ausgewählt werden.',
            'ids.regex' => 'Das Format der Buchungs-IDs ist ungültig.',
        ];
    }

    /**
     * Get the booking IDs as an array of integers.
     *
     * @return array<int>
     */
    public function getBookingIds(): array
    {
        $ids = explode(',', $this->input('ids', ''));

        return array_values(array_filter(array_map('intval', $ids), fn ($id) => $id > 0));
    }
}
