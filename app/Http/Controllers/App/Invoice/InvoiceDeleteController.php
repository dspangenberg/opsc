<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceLine;

class InvoiceDeleteController extends Controller
{
    public function __invoke(Invoice $invoice)
    {

        if ($invoice->is_draft) {

            InvoiceLine::where('invoice_id', $invoice->id)->delete();

            $invoice->delete();

            return redirect()->route('app.invoice.index');
        }

        abort('Cannot delete a published invoice');
    }
}
