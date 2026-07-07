<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfferInvoiceStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'invoice_type_id' => ['required', 'string', 'in:final,deposit,default'],
            'should_summarize' => ['required', 'boolean'],
            'deposit' => Rule::when($this->input('invoice_type_id') === 'deposit', ['required', 'numeric', 'min:1']),
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
