<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SeasonPeriodRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'season_id' => ['required', 'integer'],
            'begin_at' => ['required', 'date'],
            'end_at' => ['required', 'date'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
