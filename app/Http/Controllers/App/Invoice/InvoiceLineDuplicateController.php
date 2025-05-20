<?php

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

        return redirect()->route('app.invoice.line-edit',
            ['invoice' => $invoice->id, 'invoiceLine' => $duplicatedLine->id]);
    }
}
