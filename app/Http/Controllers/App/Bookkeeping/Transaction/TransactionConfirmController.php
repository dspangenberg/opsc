<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Bookkeeping\Transaction;

use App\Http\Controllers\Controller;
use App\Models\NumberRange;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionConfirmController extends Controller
{
    public function __invoke(Request $request)
    {

        $ids = $request->query('ids');
        $transactionIds = explode(',', $ids);
        $transactions = Transaction::whereIn('id', $transactionIds)->with('bank_account')->get();

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
}
