<?php

namespace App\Http\Requests;

use App\Settings\GeneralSettings;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'email' => [
                'required',
                'email',
                'unique:users,email,'.($this->route('user')?->id ?? 'NULL'),
            ],
            'is_admin' => ['required', 'boolean'],
            'is_locked' => ['required', 'boolean'],
            'avatar' => ['nullable', 'file', 'mimes:png,jpg,jpeg,webp', 'max:51200'],
            'remove_avatar' => ['nullable', 'boolean'],
            'email_account_id' => ['nullable', 'exists_if_not_empty:email_accounts,id'],
            'contact_id' => [
                'nullable',
                Rule::exists('contacts', 'id')->where(
                    fn ($query) => $query->where('company_id', app(GeneralSettings::class)->contact_id)
                ),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'email_account_id.exists_if_not_empty' => 'Das ausgewählte E-Mail-Konto ist ungültig.',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
