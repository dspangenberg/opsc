<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BookmarkRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'model' => ['required'],
            'route_name' => ['required'],
            'route_params' => ['required'],
            'is_pinned' => ['boolean'],
            'bookmark_folder_id' => ['nullable', 'exists:bookmark_folders'],
            'pos' => ['nullable', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
