<?php

namespace App\Http\Controllers\App\Time;

use App\Data\TimeData;
use App\Http\Controllers\Controller;
use App\Models\Time;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class TimeMyWeekIndexController extends Controller
{
    public function __invoke(Request $request): Response
    {
        // Parse and validate date parameters
        $dateRange = $this->parseDateRange($request);

        // Optimize query with eager loading and proper ordering
        $times = Time::query()
            ->with(['project:id,name', 'user:id,first_name,last_name,avatar_url', 'category:id,name,short_name'])
            ->withMinutes()
            ->whereNotNull('begin_at')
            ->whereBetween('begin_at', [$dateRange['start'], $dateRange['end']])
            ->orderBy('begin_at', 'desc')
            ->get();

        // Group data efficiently
        $groupedByDate = $this->groupByDate($times, true);

        return Inertia::render('App/Time/TimeMyWeek', [
            'times'         => TimeData::collect($times),
            'groupedByDate' => $groupedByDate,
            'startDate'     => $dateRange['start']->locale('de')->isoFormat('DD.MM.YYYY'),
            'endDate'       => $dateRange['end']->locale('de')->isoFormat('DD.MM.YYYY'),
            'week'          => $dateRange['start']->locale('de')->weekOfYear,
        ]);
    }

    /**
     * Parse and validate date range parameters
     */
    private function parseDateRange(Request $request): array
    {
        $startDateParam = $request->query('start_date');
        $endDateParam = $request->query('end_date');

        $startDate = $startDateParam
            ? Carbon::parse($startDateParam)->startOfWeek()->startOfDay()
            : Carbon::now()->startOfWeek()->startOfDay();

        $endDate = $endDateParam
            ? Carbon::parse($endDateParam)->endOfWeek()->endOfDay()
            : (clone $startDate)->endOfWeek()->endOfDay();

        return [
            'start' => $startDate,
            'end' => $endDate,
        ];
    }

    /**
     * Group time entries by date with optional summary calculations
     */
    private function groupByDate(Collection $times, bool $withSum = false): array
    {
        if ($times->isEmpty()) {
            return $withSum ? ['entries' => [], 'sum' => 0, 'sumByWeekday' => array_fill(0, 7, 0)] : [];
        }

        $groupedEntries = [];
        $sum = 0;
        $weekdaySums = array_fill(0, 7, 0); // Initialize weekday sums: 0 (Sun) to 6 (Sat)

        // Group by date field (ts) and process each day
        $timesByDate = $times->groupBy('ts');

        foreach ($timesByDate as $dateKey => $dayTimes) {
            // Sort times by begin_at ascending for each day
            $sortedTimes = $dayTimes->sortBy('begin_at')->values();

            // Calculate daily sum more efficiently
            $dailySum = $dayTimes->sum('mins');

            // Parse date once and cache Carbon instance
            $date = Carbon::parse($dateKey);
            $weekday = $date->dayOfWeek;

            $groupedEntries[$dateKey] = [
                'entries' => $sortedTimes,
                'date' => $date->toDateString(),
                'formatedDate' => $date->locale('de')->isoFormat('dddd, DD. MMMM YYYY'),
                'sum' => $dailySum,
                'weekday' => $weekday,
            ];

            // Accumulate totals
            $sum += $dailySum;
            $weekdaySums[$weekday] += $dailySum;
        }

        return $withSum ? [
            'entries' => $groupedEntries,
            'sum' => $sum,
            'sumByWeekday' => $weekdaySums, // 0..6 => Minutes per weekday
        ] : $groupedEntries;
    }
}
