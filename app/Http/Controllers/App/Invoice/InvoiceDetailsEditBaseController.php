<?php
/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Data\InvoiceData;
use App\Data\InvoiceTypeData;
use App\Data\ProjectData;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\InvoiceType;
use App\Models\Project;
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
                }
            ])
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');

        $invoiceTypes = InvoiceType::orderBy('display_name')->get();
        $projects = Project::whereNot('is_archived')->orderBy('name')->get();

        return Inertia::render('App/Invoice/InvoiceDetailsEditBaseData', [
            'invoice' => InvoiceData::from($invoice),
            'invoice_types' => InvoiceTypeData::collect($invoiceTypes),
            'projects' => ProjectData::collect($projects),
        ]);

    }
}
