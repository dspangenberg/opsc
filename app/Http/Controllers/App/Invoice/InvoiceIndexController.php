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

        $year = $request->query('year');
        if ($year === null) {
            $year = $currentYear;
        }

        if ($year && ! $years->contains($year)) {
            $years->push($year);
        }

        $stats = Invoice::query()
            ->selectRaw('SUM(lines.amount) as total_net')
            ->selectRaw('SUM(lines.tax) as total_tax')
            ->selectRaw('SUM(lines.amount + lines.tax) as total_gross')
            ->join('invoice_lines as lines', 'invoices.id', '=', 'lines.invoice_id')
            ->where('is_draft', false)
            ->byYear($year)
            ->where('is_loss_of_receivables', 0)
            ->get();

        $loss_of_receivables = Invoice::query()
            ->selectRaw('SUM(lines.amount) as loss_of_receivables')
            ->join('invoice_lines as lines', 'invoices.id', '=', 'lines.invoice_id')
            ->byYear($year)
            ->where('is_loss_of_receivables', 1)
            ->get();

        $stats[0]['total_loss_of_receivables'] = $loss_of_receivables[0]['loss_of_receivables'];


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
            ->orderBy('issued_on', 'desc')->orderBy('invoice_number', 'desc')
            ->paginate(15);

        $invoices->appends($_GET)->links();

        return Inertia::render('App/Invoice/InvoiceIndex', [
            'invoices' => InvoiceData::collect($invoices),
            'years' => $years,
            'stats' => $stats[0],
            'currentYear' => $year,
        ]);
    }
}
