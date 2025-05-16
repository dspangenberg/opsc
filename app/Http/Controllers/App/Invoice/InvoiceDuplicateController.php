<?php
/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use Carbon\Carbon;

class InvoiceDuplicateController extends Controller
{
    public function __invoke(Invoice $invoice)
    {
        $duplicatedInvoice = new Invoice($invoice->toArray());

        $duplicatedInvoice->id = null;
        $duplicatedInvoice->issued_on = Carbon::now()->format('Y-m-d');
        $duplicatedInvoice->is_draft = 1;
        $duplicatedInvoice->invoice_number = 0;
        $duplicatedInvoice->save();

        $invoice->lines()->each(function ($line) use ($duplicatedInvoice) {
            $line->invoice_id = $duplicatedInvoice->id;
            InvoiceLine::create($line->toArray());
        });

        return redirect()->route('app.invoice.details', ['invoice' => $duplicatedInvoice->id]);
    }
}
