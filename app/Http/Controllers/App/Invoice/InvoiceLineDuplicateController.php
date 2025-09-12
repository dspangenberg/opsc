<?php

namespace App\Http\Controllers\App\Invoice;

use App\Data\InvoiceData;
use App\Data\InvoiceLineData;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use Inertia\Inertia;

class InvoiceLineDuplicateController extends Controller
{
    public function __invoke(Invoice $invoice, InvoiceLine $invoiceLine)
    {
        $invoice
            ->load('tax')
            ->load('tax.rates');

        $duplicatedLine = $invoiceLine->replicate();
        $duplicatedLine->pos = InvoiceLine::query()->where('invoice_id', $invoice->id)->where('pos', '<>', 999)->max('pos') + 1;
        return Inertia::modal('App/Invoice/InvoiceDetailsEditLine')
            ->with([
                'invoice' => InvoiceData::from($invoice),
                'invoiceLine' => InvoiceLineData::from($duplicatedLine),
            ])->baseRoute('app.invoice.details', [
                'invoice' => $invoice->id,
            ]);

    }
}
