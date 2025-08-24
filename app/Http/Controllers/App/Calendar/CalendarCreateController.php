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

class CalendarCreateController extends Controller
{
    public function __invoke()
    {
        $calendarCount = Calendar::count();

        $calendar = new Calendar;
        $calendar->is_default = $calendarCount === 0;

        return Inertia::modal('App/Calendar/CalendarEdit', [
            'calendar' => BankAccountData::from($calendar),
        ])->baseRoute('app.dashboard');
    }
}
