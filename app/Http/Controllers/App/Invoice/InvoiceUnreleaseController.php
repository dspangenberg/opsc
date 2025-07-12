<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;

class InvoiceUnreleaseController extends Controller
{
    public function __invoke(Invoice $invoice)
    {
        if ($invoice->sent_at) {
            abort('Invoice cannot be unreleased once it has been sent.');
        }


        $invoice->invoice_number = null;
        $invoice->is_draft = true;
        $invoice->save();

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }
}
