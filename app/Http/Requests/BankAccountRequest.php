<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BankAccountRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:30'],
            'iban' => Rule::when($this->boolean('is_paypal') === false, ['required', 'string', 'max:34']),
            'bic' => Rule::when($this->boolean('is_paypal') === false, ['required', 'string', 'max:11']),
            'email' => Rule::when($this->boolean('is_paypal') === true, ['required', 'string', 'email']),
            'bank_name' => Rule::when($this->boolean('is_paypal') === false, ['required', 'string', 'max:30']),
            'account_owner' => ['required', 'string', 'max:30'],
            'pos' => ['nullable', 'integer'],
            'prefix' => ['nullable', 'string'],
            'bookkeeping_account_id' => ['nullable', 'integer', 'exists_if_not_empty:bookkeeping_accounts,account_number'],
            'is_paypal' => ['required', 'boolean'],
            'is_closed' => ['required', 'boolean'],
        ];
    }
}
