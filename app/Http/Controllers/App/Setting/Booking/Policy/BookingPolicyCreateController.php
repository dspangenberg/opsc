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

class BookingPolicyCreateController extends Controller
{
    public function __invoke()
    {
        $bookingPolicy = new BookingPolicy;

        return Inertia::modal('App/Settings/Booking/BookingPolicy/BookingPolicyEdit', [
            'policy' => BookingPolicyData::from($bookingPolicy),
        ])->baseRoute('app.settings.booking.policies');
    }
}
