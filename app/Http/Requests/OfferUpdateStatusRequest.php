<?php

namespace App\Http\Requests;

use App\Enums\OfferStatusEnum;
use App\Enums\PagebreakEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfferUpdateStatusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(OfferStatusEnum::class)],
            'status_name' => ['required', 'string'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
