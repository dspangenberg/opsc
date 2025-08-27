<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Data\InvoiceData;
use App\Data\TransactionData;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Transaction;
use Inertia\Inertia;

class InvoicePaymentCreateController extends Controller
{
    public function __invoke(Invoice $invoice)
    {
        $transactions = Transaction::query()
            ->where('contact_id', $invoice->contact_id)
            ->whereDoesntHave('payments')
            ->where('is_locked', true)
            ->get();

        $invoice
            ->load('invoice_contact')
            ->load('contact')
            ->load('project')
            ->load('payment_deadline')
            ->load('type')
            ->load([
                'lines' => function ($query) {
                    $query->orderBy('pos')->orderBy('id');
                },
            ])
            ->load('lines.linked_invoice')
            ->load('tax')
            ->load('tax.rates')
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');

        return Inertia::modal('App/Invoice/InvoiceDetailsCreatePayment')
            ->with([
                'invoice' => InvoiceData::from($invoice),
                'transactions' => TransactionData::collect($transactions)
            ])->baseRoute('app.invoice.details', [
                'invoice' => $invoice->id,
            ]);

    }
}
