<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Middleware;

use App\Data\TenantData;
use App\Data\TimeData;
use App\Data\UserData;
use App\Models\Time;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $tenant = tenant();

        $user = $request->user();

       $runningTimer = $user ? Time::query()
           ->where('user_id', $user->id)
           ->whereNull('end_at')
           ->latest('begin_at')
           ->with(['category', 'project'])
           ->first() : null;
       
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? UserData::from($request->user()) : null,
                'tenant' => $request->user() ? tenant('id') ? TenantData::from($tenant) : [] : null,
                'runningTimer' => $runningTimer ? TimeData::from($runningTimer) : null,
            ],
        ];
    }
}
