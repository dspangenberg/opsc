<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalendarEventRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required'],
            'start_at' => ['required', 'date'],
            'end_at' => ['required'],
            'is_fullday' => ['boolean'],
            'body' => ['required'],
            'category_id' => ['required', 'integer'],
            'location_id' => ['required', 'integer'],
            'website' => ['required'],
            'ticketshop_id' => ['required', 'integer'],
            'calendar_id' => ['required', 'integer'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
