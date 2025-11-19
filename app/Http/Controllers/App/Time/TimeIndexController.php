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
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TimeIndexController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $query = Time::query()
            ->applyDynamicFilters($request, [
                'allowed_filters' => ['project_id', 'begin_at', 'time_category_id', 'user_id', 'note', 'is_locked', 'is_billable'],
            ])
            ->with('project')
            ->withMinutes()
            ->with('category')
            ->with('user')
            ->whereNotNull('begin_at');

        $billableTimesPerProject = Time::query()
            ->where('is_billable', 1)
            ->where('is_locked', 0)
            ->where('invoice_id', 0)
            ->select(
                'project_id',
                DB::raw('SUM(TIMESTAMPDIFF(MINUTE, begin_at, end_at)) as total_mins'),
                DB::raw('MIN(begin_at) as first_entry_at'),
                DB::raw('MAX(end_at)   as last_entry_at')
            )
            ->groupBy('project_id');

        // 2. Projekte + Aggregationswerte joinen
        $billableProjects = Project::query()
            ->joinSub($billableTimesPerProject, 't', function ($join) {
                $join->on('t.project_id', '=', 'projects.id');
            })
            ->select(
                'projects.*',
                't.total_mins',
                't.first_entry_at',
                't.last_entry_at'
            )
            ->orderBy('projects.name')
            ->get();

        /** @var LengthAwarePaginator $times */
        $times = $query->orderBy('begin_at', 'desc')->paginate();

        /** @var Collection<int, int> $projectIds */
        $projectIds = Time::query()
            ->select('project_id')
            ->distinct()
            ->pluck('project_id');

        $projects = Project::whereIn('id', $projectIds)->orderBy('name')->get();

        /** @var Collection<int, Time> $timeItems */
        $timeItems = collect($times->items());
        $groupedByDate = self::groupByDate($timeItems);

        $times->appends($request->query())->links();

        // Aktuelle Filter extrahieren
        $currentFilters = [
            'project_id' => $request->input('filter.project_id', 0),
        ];

        return Inertia::render('App/Time/TimeIndex', [
            'times' => TimeData::collect($times),
            'groupedByDate' => $groupedByDate,
            'billableProjects' => $billableProjects,
            'projects' => ProjectData::collect($projects),
            'currentFilters' => $currentFilters,
        ]);
    }

    public static function groupByDate(Collection $times, bool $withSum = false): array
    {
        /** @var array<string, array<string, mixed>> $groupedEntries */
        $groupedEntries = [];
        $sum = 0;

        /** @var Collection<string, Collection<int, Time>> $timesByDate */
        $timesByDate = $times->groupBy('ts');

        foreach ($timesByDate as $key => $value) {
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

    /**
     * @param  Collection<int, Time>  $times
     * @return array<int, array<string, mixed>>
     */
    public static function groupByProjectsAndDate(Collection $times): array
    {
        /** @var Collection<int, string|null> $projects */
        $projects = $times->pluck('project.name', 'project.id');

        /** @var array<int, array<string, mixed>> $groupedEntries */
        $groupedEntries = [];

        /** @var Collection<int, Collection<int, Time>> $timesByProject */
        $timesByProject = $times->groupBy('project.id');

        foreach ($timesByProject as $key => $value) {
            $groupedByDate = self::groupByDate($value, true);
            $groupedEntries[$key]['entries'] = collect($groupedByDate['entries'])->sortBy(['date', 'asc']);
            $groupedEntries[$key]['sum'] = $groupedByDate['sum'];
            $groupedEntries[$key]['name'] = $projects->get($key);
        }

        return collect($groupedEntries)->sortBy(['name', 'asc'])->toArray();
    }
}
