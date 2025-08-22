<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Data\InvoiceData;
use App\Data\InvoiceTypeData;
use App\Data\PaymentDeadlineData;
use App\Data\ProjectData;
use App\Data\TaxData;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceType;
use App\Models\PaymentDeadline;
use App\Models\Project;
use App\Models\Tax;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class InvoiceDetailsEditBaseController extends Controller
{
    public function __invoke(Request $request, Invoice $invoice)
    {
        $invoice
            ->load('invoice_contact')
            ->load('contact')
            ->load('project')
            ->load('payment_deadline')
            ->load('type')
            ->load([
                'lines' => function ($query) {
                    $query->orderBy('pos');
                },
            ])
            ->load('tax')
            ->load('tax.rates')
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');

        $invoiceTypes = InvoiceType::query()->orderBy('display_name')->get();
        $projects = Project::where('is_archived', false)->orderBy('name')->get();
        $taxes = Tax::with('rates')->orderBy('name')->get();
        $paymentDeadlines = PaymentDeadline::orderBy('name')->get();


        return Inertia::modal('App/Invoice/InvoiceDetailsEditBaseData')
            ->with([
                'invoice' => InvoiceData::from($invoice),
                'invoice_types' => InvoiceTypeData::collect($invoiceTypes),
                'projects' => ProjectData::collect($projects),
                'taxes' => TaxData::collect($taxes),
                'payment_deadlines' => PaymentDeadlineData::collect($paymentDeadlines),
            ])->baseRoute('app.invoice.details', [
                'invoice' => $invoice->id,
            ]);


    }
}
