<?php

namespace App\Http\Controllers\App\Setting\Booking\Season;

use App\Http\Controllers\Controller;
use App\Http\Requests\SeasonRequest;
use App\Models\Season;

class SeasonStoreController extends Controller
{
    public function __invoke(SeasonRequest $request)
    {
        $validatedData = $request->validated();

        $season = Season::create($validatedData);
        $season->periods()->createMany($validatedData['periods'] ?? []);

        return redirect()->route('app.settings.booking.seasons');
    }
}
