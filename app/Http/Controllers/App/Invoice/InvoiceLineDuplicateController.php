<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceLine;

class InvoiceLineDuplicateController extends Controller
{
    public function __invoke(Invoice $invoice, InvoiceLine $invoiceLine)
    {
        $duplicatedLine = $invoiceLine->replicate();
        $duplicatedLine->save();

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id, 'line' => $duplicatedLine->id]);
    }
}
