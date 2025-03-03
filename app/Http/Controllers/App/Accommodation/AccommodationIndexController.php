<?php
/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Accommodation;

use App\Data\AccommodationData;
use App\Http\Controllers\Controller;
use App\Models\Accommodation;
use Inertia\Inertia;

class AccommodationIndexController extends Controller
{
    public function __invoke()
    {

        $accommodations = Accommodation::query()->with('type')->get();

        return Inertia::render('App/Accommodation/AccommodationIndex', [
            'accommodations' => AccommodationData::class::collect($accommodations)
        ]);

    }
}
