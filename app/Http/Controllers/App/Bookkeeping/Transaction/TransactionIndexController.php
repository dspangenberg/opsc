<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Bookkeeping\Transaction;

use App\Data\BankAccountData;
use App\Data\TransactionData;
use App\Http\Controllers\Controller;
use App\Models\BankAccount;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionIndexController extends Controller
{
    public function __invoke(Request $request)
    {

        $bankAccount = $request->query('bank_account_id');
        $bankAccount = $bankAccount ? BankAccount::find($bankAccount) : BankAccount::query()->orderBy('pos')->first();

        $bank_accounts = BankAccount::orderBy('pos')->get();

        $transactions = Transaction::query()
            ->where('bank_account_id', $bankAccount->id)
            ->with('bank_account')
            ->with('contact')
            ->orderBy('booked_on', 'DESC')
            ->paginate(10);

        $transactions->appends($_GET)->links();

        return Inertia::render('App/Bookkeeping/Transaction/TransactionIndex', [
            'transactions' => TransactionData::collect($transactions),
            'bank_account' => BankAccountData::from($bankAccount),
            'bank_accounts' => BankAccountData::collect($bank_accounts),
        ]);
    }
}
