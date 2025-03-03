<?php
/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Calendar;

use App\Http\Controllers\Controller;
use App\Http\Requests\CalendarRequest;
use App\Models\Calendar;
use App\Models\Inbox;

class CalendarStoreController extends Controller
{
    public function __invoke(CalendarRequest $request)
    {
        $validatedData = $request->validated();

        Calendar::create($validatedData);
        return redirect()->route('app.dashboard');
    }
}
