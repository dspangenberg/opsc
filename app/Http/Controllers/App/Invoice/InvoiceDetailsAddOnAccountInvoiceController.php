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
use App\Models\InvoiceLine;
use App\Models\InvoiceType;
use App\Models\PaymentDeadline;
use App\Models\Project;
use App\Models\Tax;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class InvoiceDetailsAddOnAccountInvoiceController extends Controller
{
    public function __invoke(Request $request, Invoice $invoice)
    {

        $linkedInvoiceIds = InvoiceLine::whereNotNull('linked_invoice_id')
            ->pluck('linked_invoice_id')
            ->toArray();


        $invoices = Invoice::query()
            ->where('contact_id', $invoice->contact_id)
            ->where('type_id', 2)
            ->whereNotIn('id', $linkedInvoiceIds)
            ->with('invoice_contact')
            ->with('contact')
            ->with('project')
            ->with('payment_deadline')
            ->with('type')
            ->with([
                'lines' => function ($query) {
                    $query->orderBy('pos');
                },
            ])
            ->with('tax')
            ->with('tax.rates')
            ->withSum('lines', 'amount')
            ->withSum('lines', 'tax')
            ->get();

        return Inertia::modal('App/Invoice/InvoiceDetailsAddOnAccountInvoice')
            ->with([
                'invoice' => InvoiceData::from($invoice),
                'invoices' => InvoiceData::collect($invoices)
            ])->baseRoute('app.invoice.details', [
                'invoice' => $invoice->id,
            ]);
    }
}
