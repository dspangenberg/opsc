<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Time;

use App\Data\ProjectData;
use App\Data\TimeData;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Time;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TimeIndexController extends Controller
{
    public function __invoke(Request $request)
    {
        // filter[starts_between]=01.01.2024,31.01.2024&filter[project_id]=7

        $times = QueryBuilder::for(Time::class)
            ->allowedFilters([
                AllowedFilter::exact('project_id'),
                AllowedFilter::scope('starts_after'),
                AllowedFilter::scope('starts_between'),
            ])
            ->with('project')
            ->withMinutes()
            ->with('category')
            ->with('user')
            ->whereNotNull('begin_at')
            ->orderBy('begin_at', 'desc')
            ->paginate();

        $projectIds = Time::query()->distinct()->pluck('project_id');
        $projects = Project::query()->whereIn('id', $projectIds)->orderBy('name')->get();

        $groupedByDate = self::groupByDate(collect($times->items()));

        $times->appends($_GET)->links();

        // Aktuelle Filter extrahieren
        $currentFilters = [
            'project_id' => $request->input('filter.project_id', 0),
        ];

        return Inertia::render('App/Time/TimeIndex', [
            'times' => TimeData::collect($times),
            'groupedByDate' => $groupedByDate,
            'projects' => ProjectData::collect($projects),
            'currentFilters' => $currentFilters, // Aktuelle Filter hinzufügen
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
