<?php
/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Http\Controllers\Controller;
use App\Http\Requests\InvoiceDetailsBaseUpdateRequest;
use App\Models\Invoice;

class InvoiceDetailsUpdateBaseController extends Controller
{
    public function __invoke(InvoiceDetailsBaseUpdateRequest $request, Invoice $invoice)
    {
        $invoice->update($request->validated());

        $invoice->service_period_begin = $request->validated('service_period_begin');
        $invoice->service_period_end = $request->validated('service_period_end');
        $invoice->save();

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);

    }
}
