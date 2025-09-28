<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;

class InvoiceCreateBookingController extends Controller
{
    public function __invoke(Invoice $invoice)
    {
        if (! $invoice->sent_at) {
            $invoice->sent_at = now();
            $invoice->save();
        }


        if ($invoice->doesntHave('booking')) {
            Invoice::createBooking($invoice);
        }

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }
}
