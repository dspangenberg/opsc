<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;


use App\Http\Controllers\Controller;
use App\Http\Requests\InvoiceStoreRequest;
use App\Models\Invoice;

class InvoiceStoreController extends Controller
{
    public function __invoke(InvoiceStoreRequest $request)
    {
        $validatedData = $request->validated();

        $validatedData['invoice_number'] = null;
        $invoice = Invoice::create($validatedData);



        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);

    }
}
