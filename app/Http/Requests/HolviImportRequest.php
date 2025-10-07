<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HolviImportRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'bank_account_id' => ['required', 'exists:bank_accounts,id'],
            'file' => 'required|file|mimes:csv|max:51200',
        ];
    }
}
