<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Http\Controllers\Controller;
use App\Http\Requests\InvoiceLineUpdateRequest;
use App\Models\Invoice;
use App\Models\InvoiceLine;

class InvoiceLineUpdateController extends Controller
{
    public function __invoke(InvoiceLineUpdateRequest $request, Invoice $invoice, InvoiceLine $invoiceLine)
    {
        $invoiceLine->update($request->validated());
        $invoiceLine->load('rate');

        if ($invoiceLine->type_id === 1) {
            $invoiceLine->amount = $invoiceLine->quantity * $invoiceLine->price;
        }

        $invoiceLine->tax_rate = $invoiceLine->rate->rate;
        $invoiceLine->tax = $invoiceLine->amount * ($invoiceLine->tax_rate / 100);
        $invoiceLine->save();

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id, 'line' => $invoiceLine->id]);
    }
}
