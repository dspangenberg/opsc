<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use Illuminate\Http\Request;


class InvoiceDetailsStoreOnAccountInvoiceController extends Controller
{
    public function __invoke(Request $request, Invoice $invoice)
    {

        $ids = $request->query('ids');
        $ids = $ids ? explode(',', $ids) : [];

        foreach ($ids as $id) {
            $linkedInvoice = Invoice::query()
                ->withSum('lines', 'amount')
                ->withSum('lines', 'tax')
                ->find($id);

            $invoiceLine = new InvoiceLine;
            $invoiceLine->type_id = 9;
            $invoiceLine->pos = 0;
            $invoiceLine->invoice_id = $invoice->id;
            $invoiceLine->text = '';
            $invoiceLine->amount = 0 - $linkedInvoice->amount_net;
            $invoiceLine->tax = 0 - $linkedInvoice->amount_tax;
            $invoiceLine->linked_invoice_id = $linkedInvoice->id;
            $invoiceLine->save();
        }

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }
}
