<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App;

use App\Data\ContactData;
use App\Data\InvoiceData;
use App\Data\InvoiceTypeData;
use App\Data\PaymentDeadlineData;
use App\Data\ProjectData;
use App\Data\TaxData;
use App\Data\TransactionData;
use App\Http\Controllers\Controller;
use App\Http\Requests\InvoiceDetailsBaseUpdateRequest;
use App\Http\Requests\InvoiceStoreRequest;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use App\Models\InvoiceType;
use App\Models\Payment;
use App\Models\PaymentDeadline;
use App\Models\Project;
use App\Models\Tax;
use App\Models\Time;
use App\Models\Transaction;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $years = Invoice::query()->selectRaw('DISTINCT YEAR(issued_on) as year')->orderByRaw('YEAR(issued_on) DESC')->get()->pluck('year');
        $currentYear = date('Y');

        $year = $request->query('year');
        if ($year === null) {
            $year = $currentYear;
        }

        if ($year && !$years->contains($year)) {
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

    public function create()
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

    public function store(InvoiceStoreRequest $request)
    {
        $validatedData = $request->validated();

        $validatedData['invoice_number'] = null;
        $invoice = Invoice::create($validatedData);
        $invoice->load('contact');

        $invoice->address = $invoice->contact->getInvoiceAddress()->full_address;
        $invoice->vat_id = $invoice->contact->vat_id;
        $invoice->save();

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function show(Invoice $invoice)
    {
        $invoice
            ->load('invoice_contact')
            ->load('contact')
            ->load('project')
            ->load('payment_deadline')
            ->load('parent_invoice')
            ->load('offer')
            ->load('type')
            ->load([
                'lines' => function ($query) {
                    $query->with('linked_invoice')->with('rate')->orderBy('pos')->orderBy('id');
                },
            ])
            ->load('booking')
            ->load('tax')
            ->load('tax.rates')
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax')
            ->loadSum('payable', 'amount');

        return Inertia::render('App/Invoice/InvoiceDetails', [
            'invoice' => InvoiceData::from($invoice),
        ]);
    }

    public function edit(Invoice $invoice)
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
        $contacts = Contact::whereNotNull('debtor_number')->orderBy('name')->orderBy('first_name')->get();

        return Inertia::render('App/Invoice/InvoiceDetailsEditBaseData')
            ->with([
                'invoice' => InvoiceData::from($invoice),
                'invoice_types' => InvoiceTypeData::collect($invoiceTypes),
                'projects' => ProjectData::collect($projects),
                'taxes' => TaxData::collect($taxes),
                'payment_deadlines' => PaymentDeadlineData::collect($paymentDeadlines),
                'contacts' => ContactData::collect($contacts),
            ]);
    }

    public function update(InvoiceDetailsBaseUpdateRequest $request, Invoice $invoice)
    {
        $oldContactId = $invoice->contact_id;
        if ($request->validated('project_id') === -1) {
            $invoice->project_id = 0;
            $invoice->save();
        }

        $invoice->update($request->validated());
        if ($request->validated('contact_id') !== $oldContactId) {
            $invoice->load('contact');
            $invoice->address = $invoice->contact->getInvoiceAddress()->full_address;
            $invoice->vat_id = $invoice->contact->vat_id;
            $invoice->save();
        }

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function updateLines(Request $request, Invoice $invoice)
    {
        $validatedLines = $request->lines;

        // Simply pass the validated array data to updatePositions
        // The model will handle the data as arrays, not DTOs
        $invoice->updatePositions($validatedLines);

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function destroy(Invoice $invoice)
    {
        if ($invoice->is_draft) {
            InvoiceLine::where('invoice_id', $invoice->id)->delete();
            $invoice->delete();

            Time::where('invoice_id', $invoice->id)->update(['invoice_id' => 0]);

            return redirect()->route('app.invoice.index');
        }

        abort('Cannot delete a published invoice');
    }

    public function duplicate(Invoice $invoice)
    {
        $duplicatedInvoice = Invoice::duplicateInvoice($invoice);

        return redirect()->route('app.invoice.details', ['invoice' => $duplicatedInvoice->id]);
    }

    /**
     * @throws \Throwable
     */
    public function cancel(Invoice $invoice)
    {
        $existing = Invoice::query()
            ->where('parent_id', $invoice->id)
            ->where('type_id', 5)
            ->first();

        if ($existing) {
            return redirect()->route('app.invoice.details', ['invoice' => $existing->id]);
        }
        $duplicatedInvoice = DB::transaction(function () use ($invoice) {
            $duplicatedInvoice = Invoice::duplicateInvoice($invoice);
            $duplicatedInvoice->load('lines');
            $duplicatedInvoice->type_id = 5;
            $duplicatedInvoice->parent_id = $invoice->id;
            $duplicatedInvoice->is_recurring = false;
            $duplicatedInvoice->save();

            $duplicatedInvoice->lines->each(function ($line) {
                $line->quantity = $line->quantity * -1;
                $line->tax = $line->tax * -1;
                $line->amount = $line->amount * -1;
                $line->save();
            });

            return $duplicatedInvoice;
        });

        return redirect()->route('app.invoice.details', ['invoice' => $duplicatedInvoice->id]);
    }

    public function release(Invoice $invoice)
    {
        $invoice->release();

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function unrelease(Invoice $invoice)
    {
        if ($invoice->sent_at) {
            abort('Invoice cannot be unreleased once it has been sent.');
        }

        $invoice->invoice_number = null;
        $invoice->is_draft = true;

        if ($invoice->is_recurring) {
            if ($invoice->issued_on?->toDateString() === $invoice->recurring_begin_on?->toDateString()) {
                $invoice->recurring_begin_on = null;
            }
            $invoice->recurring_next_billing_date = null;
        }

        $invoice->save();

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function markAsSent(Invoice $invoice)
    {
        if (!$invoice->sent_at) {
            $invoice->sent_at = now();
            $invoice->save();

            Invoice::createBooking($invoice);
        }

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    /**
     * @throws Exception
     */
    public function downloadPdf(Invoice $invoice): BinaryFileResponse
    {
        // $file = '/Invoicing/Invoices/'.$invoice->issued_on->format('Y').'/'.$invoice->filename;

        $pdfFile = Invoice::createOrGetPdf($invoice, false);

        return response()->file($pdfFile);
    }

    public function history(Invoice $invoice, ?int $line = null)
    {
        $invoice
            ->load('invoice_contact')
            ->load('contact')
            ->load('project')
            ->load('payment_deadline')
            ->load('parent_invoice')
            ->load('type')
            ->load([
                'lines' => function ($query) {
                    $query->orderBy('pos');
                },
            ])
            ->load('lines.linked_invoice')
            ->load('tax')
            ->load('tax.rates')
            ->load('payable')
            ->load('payable.transaction')
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');

        sreturn Inertia::render('App/Invoice/InvoiceHistory', [
            'invoice' => InvoiceData::from($invoice),
        ]);
    }

    public function createBooking(Invoice $invoice)
    {
        if (!$invoice->sent_at) {
            $invoice->sent_at = now();
            $invoice->save();
        }

        if ($invoice->doesntHave('booking')) {
            Invoice::createBooking($invoice);
        }

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function addOnAccountInvoice(Invoice $invoice)
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
                'invoices' => InvoiceData::collect($invoices),
            ])->baseRoute('app.invoice.details', [
                'invoice' => $invoice->id,
            ]);
    }

    public function storeOnAccountInvoice(Request $request, Invoice $invoice)
    {
        $ids = $request->query('ids');
        $ids = $ids ? explode(',', $ids) : [];

        foreach ($ids as $id) {
            $linkedInvoice = Invoice::query()
                ->withSum('lines', 'amount')
                ->withSum('lines', 'tax')
                ->find($id);

            $invoiceLine = new InvoiceLine;
            $invoiceLine->type_id = 9;
            $invoiceLine->pos = 999;
            $invoiceLine->invoice_id = $invoice->id;
            $invoiceLine->text = '';
            $invoiceLine->amount = 0 - $linkedInvoice->amount_net;
            $invoiceLine->tax = 0 - $linkedInvoice->amount_tax;
            $invoiceLine->linked_invoice_id = $linkedInvoice->id;
            $invoiceLine->save();
        }

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function createPayment(Invoice $invoice)
    {
        $transactions = Transaction::query()
            ->where('counter_account_id', $invoice->contact->debtor_number)
            ->whereRaw('amount - COALESCE((SELECT SUM(amount) FROM payments WHERE transaction_id = transactions.id), 0) > 0.01')
            ->where('is_locked', true)
            ->get();

        $invoice
            ->load('invoice_contact')
            ->load('contact')
            ->load('project')
            ->load('payment_deadline')
            ->load('type')
            ->load([
                'lines' => function ($query) {
                    $query->with('linked_invoice')->orderBy('pos')->orderBy('id');
                },
            ])
            ->load('tax')
            ->load('tax.rates')
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');

        return Inertia::modal('App/Invoice/InvoiceDetailsCreatePayment')
            ->with([
                'invoice' => InvoiceData::from($invoice),
                'transactions' => TransactionData::collect($transactions),
            ])->baseRoute('app.invoice.details', [
                'invoice' => $invoice->id,
            ]);
    }

    public function storePayment(Request $request, Invoice $invoice)
    {
        $ids = $request->query('ids');
        $ids = $ids ? explode(',', $ids) : [];
        $invoice
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');

        $transactions = Transaction::whereIn('id', $ids)->get();
        $transactions->each(function ($transaction) use ($invoice) {
            $payment = new Payment;
            $payment->payable()->associate($invoice);
            $payment->transaction_id = $transaction->id;
            $payment->issued_on = $transaction->booked_on;
            $payment->is_currency_difference = false;

            if ($transaction->remaining_amount > $invoice->amount_gross) {
                $payment->amount = $invoice->amount_gross;
            } else {
                $payment->amount = $transaction->remaining_amount;
            }

            if ($transaction->remaining_amount > 0) {
                $payment->save();
            }
        });

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function deleteLine(Invoice $invoice, InvoiceLine $invoiceLine)
    {
        if ($invoiceLine->invoice_id === $invoice->id) {
            $invoiceLine->delete();
        }

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }
}
