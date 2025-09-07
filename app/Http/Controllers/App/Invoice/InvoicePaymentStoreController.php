<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Transaction;
use Illuminate\Http\Request;

class InvoicePaymentStoreController extends Controller
{
    public function __invoke(Request $request, Invoice $invoice)
    {

        $ids = $request->query('ids');
        $ids = $ids ? explode(',', $ids) : [];
        $invoice
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');

        $transactions = Transaction::whereIn('id', $ids)->get();
        $transactions->each(function ($transaction) use ($invoice) {
            $payment = new Payment;
            $payment->payable()->associate($invoice);
            $payment->transaction_id = $transaction->id;
            $payment->issued_on = $transaction->booked_on;
            $payment->is_currency_difference = false;

            if ($transaction->remaining_amount > $invoice->amount_gross) {
                $payment->amount = $invoice->amount_gross;
            } else {
                $payment->amount = $transaction->remaining_amount;
            }

            if ($transaction->remaining_amount > 0) {
                $payment->save();
            }
        });

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);

    }
}
