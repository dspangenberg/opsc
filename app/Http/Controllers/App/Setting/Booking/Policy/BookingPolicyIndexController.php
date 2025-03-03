<?php
/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Setting\Booking\Policy;

use App\Data\BookingPolicyData;
use App\Http\Controllers\Controller;
use App\Models\BookingPolicy;
use Inertia\Inertia;

class BookingPolicyIndexController extends Controller
{
    public function __invoke()
    {
        $policies = BookingPolicy::orderBy('is_default', 'DESC')->orderBy('name')->get();

        return Inertia::render('App/Settings/Booking/BookingPolicy/BookingPolicyIndex', [
            '$policies' => BookingPolicyData::class::collect($policies)
        ]);
    }
}
