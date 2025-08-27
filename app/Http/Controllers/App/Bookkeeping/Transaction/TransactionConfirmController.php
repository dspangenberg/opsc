<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Bookkeeping\Transaction;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Inertia\Inertia;
use Illuminate\Http\Request;

class TransactionConfirmController extends Controller
{
    public function __invoke(Request $request)
    {

        $ids = $request->query('ids');
        $transactionIds = explode(',', $ids);
        $transactions = Transaction::whereIn('id', $transactionIds)->get();

        $transactions->each(function ($transaction) {
            if (!$transaction->is_locked) {
                $transaction->is_locked = true;
                $transaction->save();
            }
        });

        $transactions = Transaction::whereIn('id', $transactionIds)->get();

        Inertia::render('App/Bookkeeping/Transaction/TransactionIndex', [
            'transactions' => Inertia::deepMerge($transactions)->matchOn('id'),
        ]);
    }
}
