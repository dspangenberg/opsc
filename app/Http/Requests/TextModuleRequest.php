<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TextModuleRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required'],
            'content' => ['required'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
