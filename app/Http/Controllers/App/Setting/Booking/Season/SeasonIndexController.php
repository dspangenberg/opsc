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

class SeasonIndexController extends Controller
{
    public function __invoke()
    {
        $seasons = Season::with('periods')->orderBy('is_default', 'DESC')->orderBy('name')->get();

        return Inertia::render('App/Settings/Booking/Season/SeasonIndex', [
            'seasons' => SeasonData::collect($seasons)
        ]);
    }
}
