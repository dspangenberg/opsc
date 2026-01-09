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
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
