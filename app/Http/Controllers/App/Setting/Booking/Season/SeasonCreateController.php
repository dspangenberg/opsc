<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Setting\Booking\Season;

use App\Data\SeasonData;
use App\Http\Controllers\Controller;
use App\Models\Season;
use Inertia\Inertia;

class SeasonCreateController extends Controller
{
    public function __invoke()
    {
        return Inertia::modal('App/Settings/Booking/Season/SeasonEdit', [
            'season' => SeasonData::from(new Season)
        ])->baseRoute('app.settings.booking.seasons');
    }
}
