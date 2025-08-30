<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Bookkeeping\Booking;

use App\Data\BankAccountData;
use App\Data\BookkeepingBookingData;
use App\Data\TransactionData;
use App\Http\Controllers\Controller;
use App\Models\BookkeepingBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingIndexController extends Controller
{
    public function __invoke(Request $request)
    {

        $bookings = BookkeepingBooking::query()
            ->with('account_credit')
            ->with('account_debit')
            ->with('tax')
            ->with('range_document_number')
            ->orderBy('date', 'DESC')
            ->orderBy('id', 'DESC')
            ->paginate(10);

        $bookings->appends($_GET)->links();

        return Inertia::render('App/Bookkeeping/Booking/BookingIndex', [
            'bookings' => BookkeepingBookingData::collect($bookings),
        ]);
    }
}
