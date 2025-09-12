<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Data\InvoiceData;
use App\Data\InvoiceLineData;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use App\Models\TaxRate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceLineCreateController extends Controller
{
    public function __invoke(Request $request, Invoice $invoice)
    {

        $invoice
            ->load('invoice_contact')
            ->load('contact')
            ->load('project')
            ->load('payment_deadline')
            ->load('tax')
            ->load('tax.rates')
            ->load('type')
            ->load([
                'lines' => function ($query) {
                    $query->with('linked_invoice')->orderBy('pos')->orderBy('id');
                },
            ])
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');


        $invoiceLine = new InvoiceLine;
        $invoiceLine->invoice_id = $invoice->id;
        $invoiceLine->pos = InvoiceLine::query()->where('invoice_id', $invoice->id)->where('pos', '<>', 999)->max('pos') + 1;
        $invoiceLine->text = '';
        $invoiceLine->unit = '*';
        $invoiceLine->amount = 0;
        $invoiceLine->tax = 0;
        $invoiceLine->quantity = 1;
        $invoiceLine->price = 0;
        $invoiceLine->type_id = $request->query('type', 1);
        $invoiceLine->tax_rate_id = $invoice->tax->default_rate_id;


        return Inertia::modal('App/Invoice/InvoiceDetailsEditLine')
            ->with([
                'invoice' => InvoiceData::from($invoice),
                'invoiceLine' => InvoiceLineData::from($invoiceLine),
            ])->baseRoute('app.invoice.details', [
                'invoice' => $invoice->id,
            ]);


    }
}
