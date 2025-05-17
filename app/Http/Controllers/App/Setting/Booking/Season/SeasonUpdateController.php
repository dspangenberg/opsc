<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Setting\Booking\Season;

use App\Http\Controllers\Controller;
use App\Http\Requests\SeasonRequest;
use App\Models\Season;
use App\Models\SeasonPeriod;

class SeasonUpdateController extends Controller
{
    public function __invoke(SeasonRequest $request, Season $season)
    {
        $season->update($request->validated());

        $periods = collect($request->validated('periods'));
        $periodIds = $periods->pluck('id')->toArray();

        if (count($periodIds) > 0) {
            $season->periods()->where('season_id', $season->id)->whereNotIn('id', $periodIds)->delete();
        }

        $inserts = $periods->where('id', null);
        $updates = $periods->where('id', '!=', null);

        if ($inserts->count() > 0) {
            $season->periods()->createMany($inserts->toArray());
        }

        if ($updates->count() > 0) {
            foreach ($updates as $record) {
                $period = SeasonPeriod::find($record['id']);
                $period->update($record);
            }
        }

        return to_route('app.settings.booking.seasons');
    }
}
