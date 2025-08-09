<?php

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
        $startDateParam = $request->query('start_date');
        $endDateParam   = $request->query('end_date');

        $startDate = $startDateParam
            ? Carbon::parse($startDateParam)->startOfWeek()->startOfDay()
            : Carbon::now()->startOfWeek()->startOfDay();

        $endDate = $endDateParam
            ? Carbon::parse($endDateParam)->endOfWeek()->endOfDay()
            : (clone $startDate)->endOfWeek()->endOfDay();

        $times = Time::query()
            ->with(['project', 'category', 'user'])
            ->withMinutes()
            ->whereNotNull('begin_at')
            ->whereBetween('begin_at', [$startDate, $endDate])
            ->orderBy('begin_at', 'desc')
            ->paginate();

        $times->appends($request->query());

        $groupedByDate = self::groupByDate(collect($times->items()), true);

        return Inertia::render('App/Time/TimeMyWeek', [
            'times'         => TimeData::collect($times),
            'groupedByDate' => $groupedByDate,
            'startDate'     => $startDate->locale('de')->isoFormat('DD.MM.YYYY'),
            'endDate'       => $endDate->locale('de')->isoFormat('DD.MM.YYYY'),
            'week'          => $startDate->locale('de')->weekOfYear,
        ]);
    }

    public static function groupByDate(Collection $times, bool $withSum = false): array
    {
        $groupedEntries = [];
        $sum = 0;

        // Wochentags-Summen initialisieren: 0 (So) bis 6 (Sa)
        $weekdaySums = array_fill(0, 7, 0);

        foreach ($times->groupBy('ts') as $key => $value) {
            $sorted = $value->sortBy([['begin_at', 'asc']])->values();

            $date = Carbon::parse($key);
            $dailySum = $value->sum('mins');
            $weekday = $date->dayOfWeek;

            $groupedEntries[$key] = [
                'entries'      => $sorted,
                'date'         => $date->toDateString(),
                'formatedDate' => $date->locale('de')->isoFormat('dddd, DD. MMMM YYYY'),
                'sum'          => $dailySum,
                'weekday'      => $weekday,
            ];

            $sum += $dailySum;
            $weekdaySums[$weekday] += $dailySum;
        }

        if ($withSum) {
            return [
                'entries'       => $groupedEntries,
                'sum'           => $sum,
                'sumByWeekday'  => $weekdaySums, // 0..6 => Minuten pro Wochentag
            ];
        }

        return $groupedEntries;
    }
}
