<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Bookkeeping\Transaction;

use App\Data\BankAccountData;
use App\Data\BookkeepingAccountData;
use App\Data\TransactionData;
use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\BookkeepingAccount;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionIndexController extends Controller
{
    public function __invoke(Request $request, ?BankAccount $bank_account = null)
    {

        if (! $bank_account) {
            $bank_account = BankAccount::query()->orderBy('pos')->first();
        }

        $bank_accounts = BankAccount::orderBy('pos')->get();

        // POST-Daten für Filter verwenden, mit Fallback auf GET für initiale Seitenaufrufe
        $filters = $request->input('filters', []);
        $search = $request->input('search', '');

        $transactions = Transaction::query()
            ->where('bank_account_id', $bank_account->id)
            ->applyFiltersFromObject($filters, [
                'allowed_filters' => ['is_locked', 'counter_account_id'],
                'allowed_operators' => ['=', '!=', 'like', 'scope'],
                'allowed_scopes' => ['hide_private'],
            ])
            ->search($search)
            ->with('bank_account')
            ->with('contact')
            ->with('account')
            ->with('range_document_number')
            ->with('booking')
            ->orderBy('booked_on', 'DESC')
            ->orderBy('id', 'DESC')
            ->paginate(10);

        // Bei POST-Requests sollten wir die aktuellen Filter/Search-Parameter für die Paginierung beibehalten
        if ($request->isMethod('POST')) {
            $transactions->appends($request->only(['filters', 'search']));
        } else {
            $transactions->appends($_GET)->links();
        }

        $bookkeeping_accounts = BookkeepingAccount::query()->orderBy('account_number')->get();

        return Inertia::render('App/Bookkeeping/Transaction/TransactionIndex', [
            'transactions' => TransactionData::collect($transactions),
            'bank_account' => BankAccountData::from($bank_account),
            'bank_accounts' => BankAccountData::collect($bank_accounts),
            'bookkeeping_accounts' => BookkeepingAccountData::collect($bookkeeping_accounts),
            // Aktuelle Filter und Search-Parameter an Frontend zurückgeben
            'currentFilters' => $filters,
            'currentSearch' => $search,
        ]);
    }
}
