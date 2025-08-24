<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Calendar;

use App\Data\BankAccountData;
use App\Http\Controllers\Controller;
use App\Models\Calendar;
use Inertia\Inertia;

class CalendarEditController extends Controller
{
    public function __invoke(Calendar $calendar)
    {

        return Inertia::modal('App/Calendar/CalendarEdit', [
            'calendar' => BankAccountData::from($calendar),
        ])->baseRoute('app.calendar', ['calendar']);
    }
}
