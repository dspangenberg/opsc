<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SeasonRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required'],
            'is_default' => ['boolean'],
            'color' => ['required', 'string', 'regex:/^#(?:[0-9a-fA-F]{3}){1,2}$/i'],
            'booking_mode' => ['required', 'integer'],
            'has_season_related_restrictions' => ['boolean'],
            'periods' => ['array'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
