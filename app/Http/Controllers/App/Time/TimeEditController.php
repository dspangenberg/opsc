<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Time;

use App\Data\ProjectData;
use App\Data\TimeCategoryData;
use App\Data\TimeData;
use App\Data\UserData;
use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Time;
use App\Models\TimeCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class TimeEditController extends Controller
{
    public function __invoke(Request $request, Time $time)
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
                'users' => UserData::collect($users)
            ])->baseRoute($baseRoute);
    }
}
