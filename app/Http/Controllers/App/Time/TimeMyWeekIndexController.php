<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Time;

use App\Data\TimeData;
use App\Http\Controllers\Controller;
use App\Models\Time;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class TimeMyWeekIndexController extends Controller
{
    public function __invoke(Request $request)
    {

        // 28

        $times = Time::query()
            ->with('project')
            ->withMinutes()
            ->with('category')
            ->with('user')
            ->whereNotNull('begin_at')
            ->orderBy('begin_at', 'desc')
            ->paginate();

        $groupedByDate = self::groupByDate(collect($times->items()));

        $times->appends($_GET)->links();

        return Inertia::render('App/Time/TimeMyWeek', [
            'times' => TimeData::collect($times),
            'groupedByDate' => $groupedByDate,
        ]);
    }

    public static function groupByDate(Collection $times, $withSum = false): array
    {
        $groupedEntries = [];
        $sum = 0;
        foreach ($times->groupBy('ts') as $key => $value) {
            $groupedEntries[$key]['entries'] = $value->sortBy(['begin_at', 'asc']);
            $groupedEntries[$key]['date'] = Carbon::parse($key);
            $groupedEntries[$key]['formatedDate'] = Carbon::parse($key)->settings(['locale' => 'de'])->isoFormat('dddd, DD. MMMM YYYY');
            $groupedEntries[$key]['sum'] = $value->sum('mins');
            $sum = $sum + $groupedEntries[$key]['sum'];
        }
        if ($withSum) {
            return ['entries' => $groupedEntries, 'sum' => $sum];
        }

        return $groupedEntries;
    }
}
