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
use App\Services\PdfService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TimePdfReportController extends Controller
{
    public function __invoke(Request $request)
    {
        // filter[starts_between]=01.01.2024,31.01.2024&filter[project_id]=7

        $times = QueryBuilder::for(Time::class)
            ->allowedFilters([
                AllowedFilter::exact('project_id'),
                AllowedFilter::exact('contact_id'),
                AllowedFilter::exact('category_id'),
                AllowedFilter::scope('starts_after'),
                AllowedFilter::scope('starts_between'),
            ])
            ->with('project')
            ->withMinutes()
            ->with('category')
            ->with('user')
            ->whereNotNull('begin_at')
            ->orderBy('begin_at', 'desc')
            ->paginate(1500);

        $projectIds = Time::query()->distinct()->pluck('project_id');
        $projects = Project::query()->whereIn('id', $projectIds)->orderBy('name')->get();

        $groupedByDate = self::groupByDate(collect($times->items()));


        // Aktuelle Filter extrahieren
        $currentFilters = [
            'project_id' => $request->input('filter.project_id', 0),
        ];


        $timesForReport = [
            'stats' => [
                'start' => Carbon::now(),
                'end' => Carbon::now(),
                'sum' => 0,
            ],
            'data' => $times->items(),
            'groupedByProject' => self::groupByProjectsAndDate(collect($times->items())),
            'groupedByDate' => $groupedByDate,
        ];

        $now = Carbon::now()->format('d.m.Y');
        $title = "Leistungsnachweis vom $now";

        $pdfContent = PdfService::createPdf('proof-of-activity', 'pdf.proof-of-activity.index', ['times' => $timesForReport, ''], [
            'title' => $title
        ]);

        return response()->file($pdfContent);
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
