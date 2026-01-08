<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LetterheadRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required'],
            'css' => ['nullable'],
            'is_multi' => ['boolean'],
            'is_default' => ['boolean'],
            'file' => 'nullable|file|mimes:pdf|max:51200',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
