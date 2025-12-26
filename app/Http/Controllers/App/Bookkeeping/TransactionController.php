<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Bookkeeping;

use App\Data\BankAccountData;
use App\Data\BookkeepingAccountData;
use App\Data\TransactionData;
use App\Facades\BookeepingRuleService;
use App\Facades\MoneyMoneyService;
use App\Http\Controllers\Controller;
use App\Http\Requests\HolviImportRequest;
use App\Http\Requests\MoneyMoneyImportRequest;
use App\Models\BankAccount;
use App\Models\BookkeepingAccount;
use App\Models\NumberRange;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use League\Csv\Exception;
use League\Csv\Reader;
use League\Csv\SyntaxError;
use League\Csv\UnavailableStream;

class TransactionController extends Controller
{
    public function index(Request $request, ?BankAccount $bank_account = null)
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

    public function confirm(Request $request)
    {
        $ids = $request->query('ids');
        $transactionIds = explode(',', $ids);
        $transactions = Transaction::whereIn('id', $transactionIds)->with('bank_account')->orderBy('booked_on')->get();

        $transactions->each(function ($transaction) {
            if (! $transaction->is_locked) {
                $transaction->is_locked = true;

                if (! $transaction->number_range_document_numbers_id) {
                    $transaction->number_range_document_numbers_id = NumberRange::createDocumentNumber($transaction,
                        'booked_on', $transaction->bank_account->prefix);
                }

                $transaction->save();
                Transaction::createBooking($transaction);
            }
        });

        $transactions = Transaction::whereIn('id', $transactionIds)->get();

        Inertia::render('App/Bookkeeping/Transaction/TransactionIndex', [
            'transactions' => Inertia::deepMerge($transactions)->matchOn('id'),
        ]);
    }

    public function setCounterAccount(Request $request)
    {
        $ids = $request->query('ids');
        $counterAccount = $request->query('counter_account');

        $transactionIds = explode(',', $ids);
        $transactions = Transaction::whereIn('id', $transactionIds)->with('bank_account')->get();

        $transactions->each(function ($transaction) use ($counterAccount) {
            if (! $transaction->is_locked) {
                $transaction->counter_account_id = $counterAccount;
                $transaction->save();
            }
        });

        $transactions = Transaction::whereIn('id', $transactionIds)->get();

        Inertia::render('App/Bookkeeping/Transaction/TransactionIndex', [
            'transactions' => Inertia::deepMerge($transactions)->matchOn('id'),
        ]);
    }

    /**
     * @throws UnavailableStream
     * @throws SyntaxError
     * @throws Exception
     */
    public function holviImport(HolviImportRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        // Store the uploaded file temporarily
        $uploadedFile = $request->file('file');
        $tempFilePath = $uploadedFile->store('temp');
        $fullPath = storage_path('app/'.$tempFilePath);

        $csv = Reader::createFromPath($fullPath, 'r');
        $csv->setHeaderOffset(null); // No header
        $counter = 0;
        $ids = [];
        foreach ($csv->getRecords() as $record) {
            if ($counter > 0) {
                $transaction = Transaction::firstOrNew(['mm_ref' => $record[8]]);
                if (! $transaction->is_locked) {
                    $transaction->mm_ref = $record[8];
                    $transaction->bank_account_id = $validatedData['bank_account_id'];
                    $transaction->valued_on = Carbon::createFromLocaleFormat('d.m.Y', 'de', $record[0],
                        'Europe/Berlin');
                    $transaction->booked_on = Carbon::createFromLocaleFormat('d.m.Y', 'de', $record[1],
                        'Europe/Berlin');

                    // Deutsches Zahlenformat konvertieren: "1.234,56" -> 1234.56
                    $transaction->amount = (float) str_replace(',', '.', str_replace('.', '', $record[2]));
                    $transaction->booking_text = $transaction->amount > 0 ? 'Gutschrift' : 'Zahlung';

                    $transaction->currency = $record[3];
                    $transaction->name = strtoupper($record[4]);

                    $purpose1 = $record[7];
                    $purpose2 = $record[7] !== $record[5] ? '|'.$record[5] : '';

                    $transaction->purpose = $purpose1.$purpose2;
                    $transaction->save();
                    $transaction->getContact();
                    $ids[] = $transaction->id;
                }
            }
            $counter++;
        }

        BookeepingRuleService::run('transactions', new Transaction, $ids);

        unlink($fullPath);

        return redirect()->route('app.bookkeeping.transactions.index');
    }

    public function moneyMoneyImport(MoneyMoneyImportRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        // Store the uploaded file temporarily
        $uploadedFile = $request->file('file');
        $tempFilePath = $uploadedFile->store('temp');
        $fullPath = storage_path('app/'.$tempFilePath);

        MoneyMoneyService::importJsonFile($fullPath);
        unlink($fullPath);

        return redirect()->route('app.bookkeeping.transactions.index');
    }
}
