<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Bookkeeping\Transaction;

use App\Data\InvoiceData;
use App\Data\TransactionData;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\Transaction;
use Inertia\Inertia;

class TransactionPayInvoiceCreateController extends Controller
{
    public function __invoke(Transaction $transaction)
    {
        $transaction->load('account');

        $contacts = Contact::query()->where('debtor_number', $transaction->account->account_number)->get();
        $contactIds = $contacts->pluck('id')->toArray();

        $invoices = Invoice::query()
            ->whereIn('contact_id', $contactIds)
            ->unpaid()
            ->withSum('lines', 'amount')
            ->withSum('lines', 'tax')
            ->withSum('payable', 'amount')
            ->where('is_draft', false)
            ->orderBy('issued_on', 'desc')
            ->orderBy('invoice_number', 'desc')
            ->paginate(15);

        ds($invoices->toArray());

        return Inertia::modal('App/Bookkeeping/Transaction/TransactionPayInvoice')
            ->with([
                'invoices' => InvoiceData::collect($invoices),
                'transaction' => TransactionData::from($transaction),
            ])->baseRoute('app.bookkeeping.transactions.index', [
                'transaction' => $transaction->id,
            ]);

    }
}
