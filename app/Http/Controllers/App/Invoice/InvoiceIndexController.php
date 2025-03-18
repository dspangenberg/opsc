<?php
/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Data\InvoiceData;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceIndexController extends Controller
{
    public function __invoke(Request $request)
    {
        $years = Invoice::query()->selectRaw('DISTINCT YEAR(issued_on) as year')->orderByRaw('YEAR(issued_on) DESC')->get()->pluck('year');
        $currentYear = date('Y');

        $year = $request->query('year', null);
        if ($year === null) {
            $year = $currentYear;
        }


        if (!$years->contains($currentYear)) {
            $years->push($currentYear);
        }

        $invoices = Invoice::query()
            ->with('invoice_contact')
            ->with('contact')
            ->with('project')
            ->with('payment_deadline')
            ->byYear($year)
            ->with('type')
            ->with('lines')
            ->withSum('lines', 'amount')
            ->withSum('lines', 'tax')
            ->orderBy('issued_on', 'desc')
            ->paginate(15);


        $invoices->appends($_GET)->links();

        return Inertia::render('App/Invoice/InvoiceIndex', [
            'invoices' => InvoiceData::collect($invoices),
            'years' => $years,
        ]);
    }
}
