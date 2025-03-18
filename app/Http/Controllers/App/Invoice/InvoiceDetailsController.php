<?php
/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Data\InvoiceData;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Inertia\Inertia;

class InvoiceDetailsController extends Controller
{
    public function __invoke(Invoice $invoice)
    {

        $invoice
            ->load('invoice_contact')
            ->load('contact')
            ->load('project')
            ->load('payment_deadline')
            ->load('type')
            ->load(['lines' => function ($query) {
                $query->orderBy('pos');
            }])
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');


        return Inertia::render('App/Invoice/InvoiceDetails', [
            'invoice' => InvoiceData::from($invoice)
        ]);
    }
}
