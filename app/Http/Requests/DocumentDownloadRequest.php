<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DocumentDownloadRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'type' => ['required'],
            'ids' => ['required'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
