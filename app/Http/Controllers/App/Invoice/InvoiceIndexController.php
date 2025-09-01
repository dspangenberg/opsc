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

        $view = $request->query('view', 'all');

        // Optimize stats query by combining both calculations in a single query
        $stats = Invoice::query()
            ->selectRaw('
                SUM(CASE WHEN invoices.is_loss_of_receivables = 0 THEN lines.amount ELSE 0 END) as total_net,
                SUM(CASE WHEN invoices.is_loss_of_receivables = 0 THEN lines.tax ELSE 0 END) as total_tax,
                SUM(CASE WHEN invoices.is_loss_of_receivables = 0 THEN lines.amount + lines.tax ELSE 0 END) as total_gross,
                SUM(CASE WHEN invoices.is_loss_of_receivables = 1 THEN lines.amount ELSE 0 END) as total_loss_of_receivables
            ')
            ->join('invoice_lines as lines', 'invoices.id', '=', 'lines.invoice_id')
            ->where('is_draft', false)
            ->byYear($year)
            ->first();

        // Calculate sum of open amounts for unpaid invoices
        $openAmountsStats = Invoice::query()
            ->selectRaw('
                SUM(
                    (SELECT COALESCE(SUM(amount), 0) + COALESCE(SUM(tax), 0) FROM invoice_lines WHERE invoice_id = invoices.id) - 
                    COALESCE((SELECT SUM(amount) FROM payments WHERE payable_type = ? AND payable_id = invoices.id), 0)
                ) as total_open_amount
            ')
            ->whereRaw('(
                SELECT COALESCE(SUM(amount), 0) + COALESCE(SUM(tax), 0) 
                FROM invoice_lines 
                WHERE invoice_id = invoices.id
            ) - COALESCE((
                SELECT SUM(amount) 
                FROM payments 
                WHERE payable_type = ? AND payable_id = invoices.id
            ), 0) > 0.01', [Invoice::class, Invoice::class])
            ->where('is_draft', false)
            ->byYear($year)
            ->first();

        // Merge the stats
        if ($stats && $openAmountsStats) {
            $stats->total_open_amount = $openAmountsStats->total_open_amount ?: 0;
        } elseif ($stats) {
            $stats->total_open_amount = 0;
        }

        // Optimize by combining related data and reducing N+1 queries
        $invoices = Invoice::query()
            ->with(['invoice_contact', 'contact', 'project', 'payment_deadline', 'type'])
            ->view($view)
            ->withSum('lines', 'amount')
            ->withSum('lines', 'tax')
            ->withSum('payable', 'amount')
            ->byYear($year)
            ->orderBy('issued_on', 'desc')
            ->orderBy('invoice_number', 'desc')
            ->paginate(15);

        $invoices->appends($_GET)->links();

        return Inertia::render('App/Invoice/InvoiceIndex', [
            'invoices' => InvoiceData::collect($invoices),
            'years' => $years,
            'stats' => $stats ? $stats->toArray() : [],
            'currentYear' => $year,
        ]);
    }
}
