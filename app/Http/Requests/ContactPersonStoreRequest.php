<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactPersonStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'salutation_id' => ['required', 'exists:salutations,id'],
            'is_org' => ['required', 'boolean'],
            'title_id' => ['nullable', 'exists_if_not_empty:titles,id'],
            'first_name' => ['nullable', 'string'],
            'name' => ['required', 'string'],
            'company_id' => ['required', 'exists:contacts,id'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
