<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'project_category_id' => ['required', 'exists:project_categories,id'],
            'owner_contact_id' => ['required', 'exists:contacts,id'],
            'manager_contact_id' => ['nullable', 'exists_if_not_empty:contacts,id'],
            'website' => ['nullable', 'url'],
            'avatar' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp', 'max:51200'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
