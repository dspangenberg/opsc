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
use Inertia\Inertia;

class InvoiceLineEditController extends Controller
{
    public function __invoke(Invoice $invoice, InvoiceLine $invoiceLine)
    {

        $invoiceLine->load('rate');

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
                    $query->orderBy('pos');
                },
            ])
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');

        return Inertia::render('App/Invoice/InvoiceDetailsEditLine', [
            'invoice' => InvoiceData::from($invoice),
            'invoiceLine' => InvoiceLineData::from($invoiceLine),
        ]);

    }
}
