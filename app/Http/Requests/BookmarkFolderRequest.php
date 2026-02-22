<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookmarkFolderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'pos' => ['nullable', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
