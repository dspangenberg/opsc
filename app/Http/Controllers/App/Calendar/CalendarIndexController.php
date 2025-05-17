<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Calendar;

use App\Data\CalendarData;
use App\Http\Controllers\Controller;
use App\Models\Calendar;
use Inertia\Inertia;

class CalendarIndexController extends Controller
{
    public function __invoke(Calendar $calendar)
    {

        $calendar = $calendar->load('events');

        return Inertia::render('App/Calendar/CalendarIndex', [
            'calendar' => CalendarData::from($calendar),
        ]);

    }
}
