<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Bookkeeping;

use App\Data\BookkeepingAccountData;
use App\Data\BookkeepingBookingData;
use App\Http\Controllers\Controller;
use App\Http\Requests\CorrectBookingsRequest;
use App\Models\BookkeepingAccount;
use App\Models\BookkeepingBooking;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laracsv\Export;
use League\Csv\CannotInsertRecord;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $accounts = BookkeepingAccount::query()->orderBy('account_number')->get();

        $bookings = BookkeepingBooking::query()
            ->applyDynamicFilters($request, [
                'allowed_filters' => ['is_locked', 'account_id_credit', 'account_id_debit'],
                'allowed_operators' => ['=', '!=', 'like', 'scope'],
                'allowed_scopes' => ['issuedBetween'],
            ])
            ->search($search)
            ->with('account_debit')
            ->with('account_credit')
            ->with('tax')
            ->with('range_document_number')
            ->orderBy('date', 'DESC')
            ->orderBy('id', 'DESC')
            ->paginate(10);

        // Bei POST-Requests sollten wir die aktuellen Filter/Search-Parameter für die Paginierung beibehalten
        if ($request->isMethod('POST')) {
            $bookings->appends($request->only(['filters', 'search']));
        } else {
            $bookings->appends($request->query());
        }

        return Inertia::render('App/Bookkeeping/Booking/BookingIndex', [
            'bookings' => BookkeepingBookingData::collect($bookings),
            'accounts' => BookkeepingAccountData::collect($accounts),
            'currentSearch' => $search,
            'currentFilters' => (new BookkeepingBooking)->getParsedFilters($request),
        ]);
    }

    public function indexForAccount(Request $request, string $accountNumber)
    {
        $search = $request->input('search', '');
        $filters = [];

        $account = BookkeepingAccount::query()->where('account_number', $accountNumber)->first();

        // Extrahiere Datumsfilter aus dem Request
        $parsedFilters = (new BookkeepingBooking)->getParsedFilters($request);

        if (isset($parsedFilters['filters']['issuedBetween']['value'])) {
            $dates = $parsedFilters['filters']['issuedBetween']['value'];
            if (is_array($dates) && count($dates) >= 2) {
                $filters['date_from'] = $dates[0];
                $filters['date_to'] = $dates[1];
            }
        }

        // Nutze die neue Balance-Methode mit Pagination
        $bookings = BookkeepingBooking::getRunningBalanceForAccountPaginated(
            $accountNumber,
            $filters,
            10,
            'asc'
        );

        // Bei POST-Requests sollten wir die aktuellen Filter/Search-Parameter für die Paginierung beibehalten
        if ($request->isMethod('POST')) {
            $bookings->appends($request->only(['filters', 'search']));
        } else {
            $bookings->appends($request->query());
        }

        return Inertia::render('App/Bookkeeping/Booking/BookingIndexForAccount', [
            'bookings' => BookkeepingBookingData::collect($bookings),
            'account' => BookkeepingAccountData::from($account),
            'accountNumber' => $accountNumber,
            'currentSearch' => $search,
            'currentFilters' => $parsedFilters,
        ]);
    }

    /**
     * @throws CannotInsertRecord
     */
    public function exportCSV(Request $request)
    {
        $search = $request->input('search', '');

        $bookings = BookkeepingBooking::query()
            ->applyDynamicFilters($request, [
                'allowed_filters' => ['is_locked', 'account_id_credit', 'account_id_debit'],
                'allowed_operators' => ['=', '!=', 'like', 'scope'],
                'allowed_scopes' => ['issuedBetween'],
            ])
            ->search($search)
            ->with('account_debit')
            ->with('account_credit')
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

    public function correctBookings(CorrectBookingsRequest $request): RedirectResponse
    {
        $bookingIds = $request->getBookingIds();
        $successes = [];
        $failures = [];

        foreach ($bookingIds as $bookingId) {
            try {
                BookkeepingBooking::correctBooking($bookingId);
                $successes[] = $bookingId;
            } catch (Exception $e) {
                $failures[] = [
                    'id' => $bookingId,
                    'error' => $e->getMessage(),
                ];
            }
        }

        if (count($failures) === 0) {
            Inertia::flash('toast', ['type' => 'success', 'message' => count($successes).' Buchung(en) erfolgreich korrigiert']);
        } elseif (count($successes) === 0) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Keine Buchungen konnten korrigiert werden.']);
        } else {
            Inertia::flash('toast', ['type' => 'success', 'message' => count($successes).' Buchung(en) konnten nicht korrigiert werden.']);
        }

        return back();
    }
}
