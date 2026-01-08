<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App;

use App\Data\BillableProjectData;
use App\Data\ProjectData;
use App\Data\TimeCategoryData;
use App\Data\TimeData;
use App\Data\UserData;
use App\Facades\WeasyPdfService;
use App\Http\Controllers\Controller;
use App\Http\Requests\TimeStoreRequest;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\PaymentDeadline;
use App\Models\Project;
use App\Models\Time;
use App\Models\TimeCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TimeController extends Controller
{
    public function index(Request $request): Response
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
            'projects' => ProjectData::collect($projects),
            'currentFilters' => $currentFilters,
        ]);
    }

    public function billAbleindex(): Response
    {
        $billableTimesPerProject = Time::query()
            ->billable()
            ->select(
                'project_id',
                DB::raw('SUM(TIMESTAMPDIFF(MINUTE, begin_at, end_at)) as total_mins'),
                DB::raw('MIN(begin_at) as first_entry_at'),
                DB::raw('MAX(end_at)   as last_entry_at')
            )
            ->groupBy('project_id');

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

        return Inertia::render('App/Time/TimeBillableIndex', [
            'billableProjects' => BillableProjectData::collect($billableProjects),
        ]);
    }

    public function myWeek(Request $request): Response
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
        $groupedByDate = $this->groupByDateWithWeekdays($times, true);

        return Inertia::render('App/Time/TimeMyWeek', [
            'times' => TimeData::collect($times),
            'groupedByDate' => $groupedByDate,
            'startDate' => $dateRange['start']->locale('de')->isoFormat('DD.MM.YYYY'),
            'endDate' => $dateRange['end']->locale('de')->isoFormat('DD.MM.YYYY'),
            'week' => $dateRange['start']->locale('de')->weekOfYear,
        ]);
    }

    public function storeBill(Request $request)
    {

        $times = Time::query()
            ->where('project_id', $request->input('project_id'))
            ->with('project')
            ->billable()
            ->withMinutes()
            ->with('category')
            ->with('user')
            ->whereNotNull('begin_at')
            ->whereNotNull('end_at')
            ->orderBy('begin_at', 'desc')
            ->get();

        $timeIds = $times->pluck('id');
        $categoryIds = $times->pluck('time_category_id')->unique();
        $categories = $categoryIds->map(function ($category) use ($times) {
            $timesByCategory = $times->where('time_category_id', $category);
            $totalMinutes = $timesByCategory->sum('mins');

            return [
                'id' => $category,
                'name' => $timesByCategory->first()->category->name,
                'quantity' => round(ceil($totalMinutes / 15) * 15 / 60, 2),
                'duration' => minutes_to_hours($totalMinutes),
                'times' => $timesByCategory->toArray(),
                'start' => $timesByCategory->min('begin_at')->format('d.m.Y'),
                'end' => $timesByCategory->max('end_at')->format('d.m.Y'),
            ];
        })->toArray();

        $project = Project::find($request->input('project_id'));
        $contact = Contact::find($project->owner_contact_id);

        $paymentDeadline = $contact->payment_deadline_id
            ? PaymentDeadline::find($contact->payment_deadline_id)
            : PaymentDeadline::query()->orderBy('is_default', 'DESC')->first();

        if ($contact->company_id) {
            $contact = Contact::find($contact->company_id);
        }

        // TODO: Steuersatz aus Account !

        $invoice = Invoice::create([
            'project_id' => $project->id,
            'contact_id' => $contact->id,
            'invoice_number' => null,
            'issued_on' => now(),
            'type_id' => 1,
            'is_draft' => true,
            'address' => $contact->getInvoiceAddress()->full_address,
            'payment_deadline_id' => $paymentDeadline->id,
        ]);

        $pos = 0;
        collect($categories)->each(function ($category) use ($invoice, &$pos) {
            $timeCategory = TimeCategory::find($category['id']);
            $pos++;
            $invoice->lines()->create([
                'pos' => $pos,
                'type_id' => 1,
                'quantity' => $category['quantity'],
                'price' => $timeCategory['hourly'],
                'unit' => 'h',
                'amount' => $category['quantity'] * $timeCategory['hourly'],
                'tax_rate_id' => 1,
                'tax' => $category['quantity'] * $timeCategory['hourly'] * 0.19,
                'service_period_begin' => $category['start'],
                'service_period_end' => $category['end'],
                'text' => '**'.$category['name']."**\ngem. Leistungsnachweis",
            ]);
        });

        Time::whereIn('id', $timeIds)->update(['invoice_id' => $invoice->id]);

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function create(Request $request)
    {
        $projects = Project::query()
            ->where('is_archived', false)
            ->orderBy('name')
            ->get();

        $categories = TimeCategory::query()
            ->orderBy('name')
            ->get();

        $users = User::query()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        $lastEntry = Time::query()->where('user_id', auth()->user()->id)->orderBy('begin_at', 'desc')->first();

        $time = new Time;
        $time->user_id = auth()->user()->id;
        $time->begin_at = Carbon::now();
        $time->end_at = null;

        if ($lastEntry) {
            $time->project_id = $lastEntry->project_id;
            $time->time_category_id = $lastEntry->time_category_id;
            $time->is_billable = $lastEntry->is_billable;
            $time->is_locked = $lastEntry->is_locked;
        }

        $baseRoute = $request->query('view', 'my-week') === 'my-week' ? 'app.time.my-week' : 'app.time.index';

        return Inertia::modal('App/Time/TimeCreate')
            ->with([
                'time' => TimeData::from($time),
                'projects' => ProjectData::collect($projects),
                'categories' => TimeCategoryData::collect($categories),
                'users' => UserData::collect($users),
            ])->baseRoute($baseRoute);
    }

    public function store(TimeStoreRequest $request)
    {
        $validatedData = $request->validated();

        Time::create($validatedData);
        $baseRoute = $request->query('view', 'my-week') === 'my-week' ? 'app.time.my-week' : 'app.time.index';

        return redirect()->route($baseRoute);
    }

    public function edit(Request $request, Time $time)
    {
        $projects = Project::query()
            ->where('is_archived', false)
            ->orWhere('id', $time->project_id)
            ->orderBy('name')
            ->get();

        $categories = TimeCategory::query()
            ->orderBy('name')
            ->get();

        $users = User::query()
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get();

        $baseRoute = $request->query('view', 'my-week') === 'my-week' ? 'app.time.my-week' : 'app.time.index';

        return Inertia::modal('App/Time/TimeCreate')
            ->with([
                'time' => TimeData::from($time),
                'projects' => ProjectData::collect($projects),
                'categories' => TimeCategoryData::collect($categories),
                'users' => UserData::collect($users),
            ])->baseRoute($baseRoute);
    }

    public function update(TimeStoreRequest $request, Time $time)
    {
        $validatedData = $request->validated();

        $time->update($validatedData);

        $baseRoute = $request->query('view', 'my-week') === 'my-week' ? 'app.time.my-week' : 'app.time.index';

        return redirect()->route($baseRoute);
    }

    public function destroy(Request $request, Time $time)
    {
        $time->delete();
    }

    public function pdfReport(Request $request)
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
            ->paginate(500);

        $projectIds = Time::query()->distinct()->pluck('project_id');
        $projects = Project::query()->whereIn('id', $projectIds)->orderBy('name')->get();

        $groupedByDate = self::groupByDate(collect($times->items()));

        // Aktuelle Filter extrahieren
        $currentFilters = [
            'project_id' => $request->input('filter.project_id', 0),
        ];

        $timesForReport = [
            'stats' => [
                'start' => $times->min('begin_at'),
                'end' => $times->max('end_at'),
                'sum' => $times->sum('mins'),
            ],
            'data' => $times->items(),
            'groupedByProject' => self::groupByProjectsAndDate(collect($times->items())),
            'groupedByDate' => $groupedByDate,
        ];

        $now = Carbon::now()->format('d.m.Y');
        $title = "Leistungsnachweis vom $now";

        $pdfContent = WeasyPdfService::createPdf('proof-of-activity', 'pdf.proof-of-activity.index', ['times' => $timesForReport, ''], [
            'title' => $title,
        ]);

        return response()->file($pdfContent);
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
     * Group time entries by date with optional summary calculations (for my-week view)
     */
    private function groupByDateWithWeekdays(Collection $times, bool $withSum = false): array
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
    public static function groupByCategoryAndDate(Collection $times): array
    {
        /** @var Collection<int, string|null> $projects */
        $categories = $times->pluck('category.name', 'category.id');

        /** @var array<int, array<string, mixed>> $groupedEntries */
        $groupedEntries = [];

        /** @var Collection<int, Collection<int, Time>> $timesByProject */
        $timesByProject = $times->groupBy('category.id');

        foreach ($timesByProject as $key => $value) {
            $groupedByDate = self::groupByDate($value, true);
            $groupedEntries[$key]['entries'] = collect($groupedByDate['entries'])->sortBy(['date', 'asc']);
            $groupedEntries[$key]['sum'] = $groupedByDate['sum'];
            $groupedEntries[$key]['name'] = $categories->get($key);
        }

        return collect($groupedEntries)->sortBy(['name', 'asc'])->toArray();
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
