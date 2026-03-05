<?php

namespace App\Http\Requests;

use App\Enums\OfferStatusEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfferUpdateStatusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(OfferStatusEnum::class)]
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Bitte wähle einen Status aus.',
            'status.enum' => 'Der ausgewählte Status ist ungültig.',
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
