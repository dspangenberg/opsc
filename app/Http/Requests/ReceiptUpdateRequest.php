<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class ReceiptUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'reference' => 'required|string',
            'issued_on' => ['required', 'date', 'date_format:d.m.Y'],
            'org_currency' => 'required',
            'amount' => ['required', 'numeric', 'gt:0'],
            'contact_id' => ['required', 'exists:contacts,id'],
            'cost_center_id' => ['required', 'exists:cost_centers,id'],
            'is_confirmed' => ['nullable', 'boolean'],
        ];
    }
}
