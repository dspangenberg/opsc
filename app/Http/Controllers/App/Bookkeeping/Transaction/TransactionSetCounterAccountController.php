<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Bookkeeping\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionSetCounterAccountController extends Controller
{
    public function __invoke(Request $request)
    {

        $ids = $request->query('ids');
        $counterAccount = $request->query('counter_account');

        $transactionIds = explode(',', $ids);
        $transactions = Transaction::whereIn('id', $transactionIds)->with('bank_account')->get();

        $transactions->each(function ($transaction) use ($counterAccount) {
            if (!$transaction->is_locked) {

                $transaction->counter_account_id = $counterAccount;
                $transaction->save();
            }
        });

        $transactions = Transaction::whereIn('id', $transactionIds)->get();

        Inertia::render('App/Bookkeeping/Transaction/TransactionIndex', [
            'transactions' => Inertia::deepMerge($transactions)->matchOn('id'),
        ]);
    }
}
