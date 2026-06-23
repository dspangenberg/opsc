<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfficeTemplateUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'is_default' => ['boolean'],
            'file' => 'nullable|file|mimes:docx|max:51200',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
