<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PrintLayoutRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'title' => ['required'],
            'letterhead_id' => ['required', 'exists:letterheads'],
            'css' => ['nullable'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
