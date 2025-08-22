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


class TimeIndexController extends Controller
{
    public function __invoke(Request $request)
    {
        // filter[starts_between]=01.01.2024,31.01.2024&filter[project_id]=7


        // ?filter[begin_at]=between,01.01.2024,31.01.2024

        ds($request->query);

        $filterBool = $request->query('filter_bool', 'AND');
        if ($filterBool != 'AND' && $filterBool != 'OR') {
            $filterBool = 'AND';
        }

        $filterQuery = [];
        if ($request->query('filter')) {
            $filter = $request->query('filter');
            foreach ($filter as $key => $value) {
                $values = explode(',', $value);
                if (count($values) > 1) {
                    $operator = $values[0];
                    unset($values[0]);

                    $queryValue = '';
                    switch ($operator) {
                        case 'between':
                            $queryValue = [Carbon::parse($values[1])->startOfDay(), Carbon::parse($values[2])->endOfDay()];
                            break;
                        case 'in':
                            $queryValue = $values;
                            break;
                    }




                    $filterQuery[] = [
                        'column' => $key,
                        'operator' => $operator,
                        'value' => $queryValue,
                        'boolean' => $filterBool,
                    ];
                } else {
                    $filterQuery[] = [
                        'column' => $key,
                        'operator' => '=',
                        'value' => $value,
                        'boolean' => $filterBool,
                    ];
                }

            }
        }

        ds($filterQuery);

        $times = Time::query()->when($filterQuery, function ($query) use ($filterQuery) {
            foreach ($filterQuery as $filter) {
                switch ($filter['operator']) {
                    case 'between':
                        $query->whereBetween($filter['column'], $filter['value']);
                        break;
                    case 'in':
                        $query->whereIn($filter['column'], $filter['value']);
                        break;
                    case 'not_between':
                        $query->whereNotBetween($filter['column'], $filter['value']);
                        break;
                    default:
                        $query->where($filter['column'], $filter['operator'], $filter['value'], $filter['boolean']);
                        break;
                }
            }
        })->get();

        $times = Time::query()
            ->applyDynamicFilters($request)
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

    public static function groupByProjectsAndDate(Collection $times): array
    {

        $projects = $times->pluck('project.name', 'project.id');

        $groupedEntries = [];
        foreach ($times->groupBy('project.id') as $key => $value) {
            $groupedByDate = self::groupByDate($value, true);
            $groupedEntries[$key]['entries'] = collect($groupedByDate['entries'])->sortBy(['date', 'asc']);
            $groupedEntries[$key]['sum'] = $groupedByDate['sum'];
            $groupedEntries[$key]['name'] = $projects->get($key);
        }

        return collect($groupedEntries)->sortBy(['name', 'asc'])->toArray();
    }
}
