<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Bookkeeping;

use App\Data\BookkeepingBookingData;
use App\Http\Controllers\Controller;
use App\Models\BookkeepingBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laracsv\Export;
use League\Csv\CannotInsertRecord;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $bookings = BookkeepingBooking::query()
            ->with('account_credit')
            ->search($search)
            ->with('account_debit')
            ->with('tax')
            ->with('range_document_number')
            ->orderBy('date', 'DESC')
            ->orderBy('id', 'DESC')
            ->paginate(10);

        $bookings->appends($_GET)->links();

        return Inertia::render('App/Bookkeeping/Booking/BookingIndex', [
            'bookings' => BookkeepingBookingData::collect($bookings),
            'currentSearch' => $search,
        ]);
    }

    /**
     * @throws CannotInsertRecord
     */
    public function exportCSV(Request $request)
    {
        $bookings = BookkeepingBooking::query()
            ->with('account_credit')
            ->with('account_debit')
            ->with('tax')
            ->with('range_document_number')
            ->orderBy('date', 'DESC')
            ->orderBy('id', 'DESC')
            ->get();

        $csvExporter = new Export;
        $csvExporter->beforeEach(function ($booking) {
            $booking->issuedOn = $booking->date->format('d.m.Y');
            $booking->amount = number_format($booking->amount, 2, ',', '');
            $booking->booking_text = trim($booking->booking_text, '|');
        });

        $csvExporter->build($bookings, [
            'issuedOn' => 'Belegdatum',
            'account_id_debit' => 'Sollkonto',
            'account_id_credit' => 'Habenkonto',
            'booking_text' => 'Buchungstext',
            'amount' => 'Betrag',
            'document_number' => 'Beleg',
        ]);

        return response()->streamDownload(function () use ($csvExporter) {
            echo $csvExporter->getWriter();
        }, 'buchungen.csv', ['Content-Type' => 'text/csv']);
    }
}
