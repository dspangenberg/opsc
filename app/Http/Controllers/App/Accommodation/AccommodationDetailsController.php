<?php
/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Accommodation;

use App\Http\Controllers\Controller;
use App\Models\Accommodation;
use App\Models\AccommodationType;
use App\Models\Country;
use App\Models\Region;
use Inertia\Inertia;

class AccommodationDetailsController extends Controller
{
    public function __invoke(Accommodation $accommodation)
    {

        return Inertia::render('App/Accommodation/AccommodationDetails', [
            'accommodation' => $accommodation,
            'countries' => Country::all(),
            'regions' => Region::all(),
            'types' => AccommodationType::all(),
        ]);

    }
}
