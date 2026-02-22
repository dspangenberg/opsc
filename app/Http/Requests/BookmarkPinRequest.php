<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookmarkPinRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'is_pinned' => ['boolean'],
            'bookmark_folder_id' => ['nullable', 'exists:bookmark_folders,id'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
