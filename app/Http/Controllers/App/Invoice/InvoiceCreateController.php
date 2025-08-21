<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Data\ContactData;
use App\Data\InvoiceData;
use App\Data\InvoiceTypeData;
use App\Data\PaymentDeadlineData;
use App\Data\ProjectData;
use App\Data\TaxData;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\InvoiceType;
use App\Models\PaymentDeadline;
use App\Models\Project;
use App\Models\Tax;
use Inertia\Inertia;

class InvoiceCreateController extends Controller
{
    public function __invoke()
    {
        // Load all data in single queries, ordered appropriately for defaults
        $invoiceTypes = InvoiceType::query()->orderBy('is_default', 'DESC')->orderBy('display_name')->get();
        $paymentDeadlines = PaymentDeadline::query()->orderBy('is_default', 'DESC')->orderBy('name')->get();
        $taxes = Tax::query()->with('rates')->orderBy('is_default', 'DESC')->orderBy('name')->get();
        $projects = Project::query()->where('is_archived', false)->orderBy('name')->get();
        $contacts = Contact::query()->whereNotNull('debtor_number')->orderBy('name')->orderBy('first_name')->get();

        // Create new invoice with default values from loaded collections
        $invoice = new Invoice;
        $invoice->contact_id = 0;
        $invoice->type_id = $invoiceTypes->first()?->id ?? 0;
        $invoice->is_draft = true;
        $invoice->issued_on = now();
        $invoice->invoice_contact_id = 0;
        $invoice->project_id = 0;
        $invoice->payment_deadline_id = $paymentDeadlines->first()?->id ?? 0;
        $invoice->tax_id = $taxes->first()?->id ?? 0;
        $invoice->is_recurring = false;
        $invoice->recurring_interval_days = 0;
        $invoice->invoice_number = null;

        return Inertia::modal('App/Invoice/InvoiceCreate')
            ->with([
                'invoice' => InvoiceData::from($invoice),
                'invoice_types' => InvoiceTypeData::collect($invoiceTypes),
                'projects' => ProjectData::collect($projects),
                'taxes' => TaxData::collect($taxes),
                'payment_deadlines' => PaymentDeadlineData::collect($paymentDeadlines),
                'contacts' => ContactData::collect($contacts),
            ])->baseRoute('app.invoice.index');
    }
}
