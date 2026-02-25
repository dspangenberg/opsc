<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App;

use App\Data\ContactData;
use App\Data\DocumentData;
use App\Data\InvoiceData;
use App\Data\InvoiceTypeData;
use App\Data\PaymentDeadlineData;
use App\Data\ProjectData;
use App\Data\TaxData;
use App\Data\TransactionData;
use App\Facades\WeasyPdfService;
use App\Http\Controllers\Controller;
use App\Http\Requests\InvoiceDetailsBaseUpdateRequest;
use App\Http\Requests\InvoiceReportRequest;
use App\Http\Requests\InvoiceStoreExternalRequest;
use App\Http\Requests\InvoiceStoreRequest;
use App\Http\Requests\NoteStoreRequest;
use App\Models\BookkeepingBooking;
use App\Models\Contact;
use App\Models\Document;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use App\Models\InvoiceType;
use App\Models\Payment;
use App\Models\PaymentDeadline;
use App\Models\Project;
use App\Models\Tax;
use App\Models\TaxRate;
use App\Models\Time;
use App\Models\Transaction;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Momentum\Modal\Modal;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class InvoiceController extends Controller
{
    public function index(Request $request): Response
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
            ->with([
                'invoice_contact', 'contact', 'project', 'payment_deadline', 'type', 'booking',
                'booking.range_document_number', 'booking.account_credit', 'booking.account_debit'
            ])
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

    public function create(): Response
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

    public function store(InvoiceStoreRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        $validatedData['invoice_number'] = null;
        $invoice = Invoice::create($validatedData);
        $invoice->load('contact');

        $invoice->address = $invoice->contact->getInvoiceAddress()->full_address;
        $invoice->vat_id = $invoice->contact->vat_id;
        $invoice->save();

        $invoice->addHistory('hat die Rechnung versendet.', 'created', auth()->user());

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function setLossOfReceivables(Invoice $invoice): RedirectResponse {

        // Abfrage, ob Rechnung bereits als Forderungsverlust markiert, nicht nötig, da doppelter Aufurf keine Konsequenzen hat

        if ($invoice->is_loss_of_receivables) {
            return redirect()->back()->with('error', 'Rechnung bereits als Forderungsverlust markiert');
        }

        $invoice->is_loss_of_receivables = true;
        $invoice->save();
        Invoice::createBooking($invoice);
        return redirect()->back();
    }

    public function show(Invoice $invoice): Response
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
            ->load('reminders')
            ->load('notables.creator')
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax')
            ->loadSum('payable', 'amount');

        return Inertia::render('App/Invoice/InvoiceDetails', [
            'invoice' => InvoiceData::from($invoice),
        ]);
    }

    public function edit(Invoice $invoice): Response
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

    public function update(InvoiceDetailsBaseUpdateRequest $request, Invoice $invoice): RedirectResponse
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

    public function updateLines(Request $request, Invoice $invoice): RedirectResponse
    {
        $validatedLines = $request->lines;

        // Simply pass the validated array data to updatePositions
        // The model will handle the data as arrays, not DTOs
        $invoice->updatePositions($validatedLines);

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function destroy(Invoice $invoice): RedirectResponse
    {
        if ($invoice->is_draft) {
            InvoiceLine::where('invoice_id', $invoice->id)->delete();
            $invoice->delete();

            Time::where('invoice_id', $invoice->id)->update(['invoice_id' => 0]);

            return redirect()->route('app.invoice.index');
        }

        abort('Cannot delete a published invoice');
    }

    public function duplicate(Invoice $invoice): RedirectResponse
    {
        $duplicatedInvoice = Invoice::duplicateInvoice($invoice);

        return redirect()->route('app.invoice.details', ['invoice' => $duplicatedInvoice->id]);
    }

    /**
     * @throws Throwable
     */
    public function cancel(Invoice $invoice): RedirectResponse
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

    public function release(Invoice $invoice): RedirectResponse
    {
        $invoice->release();

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function unrelease(Invoice $invoice): RedirectResponse
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

    public function markAsSent(Invoice $invoice): RedirectResponse
    {
        if (!$invoice->sent_at) {
            $invoice->sent_at = now();
            $invoice->save();

            Invoice::createBooking($invoice);
        }

        $invoice->addHistory('hat die Rechnung versendet.', 'mail_sent', auth()->user());
        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function bulkMarkAsSent(Request $request): RedirectResponse
    {
        $ids = $request->input('ids');
        $ids = $ids ? explode(',', $ids) : [];

        $invoices = Invoice::query()->whereIn('id', $ids)->get();

        foreach ($invoices as $invoice) {
            if (!$invoice->sent_at) {
                $invoice->sent_at = now();
                $invoice->save();
            }

            $hasBooking = BookkeepingBooking::whereMorphedTo('bookable', Invoice::class)
                ->where('bookable_id', $invoice->id)
                ->exists();

            if (!$hasBooking) {
                Invoice::createBooking($invoice);
            }
        }

        return redirect()->back();
    }

    /**
     * @throws Exception
     */
    public function downloadPdf(Invoice $invoice): BinaryFileResponse|StreamedResponse
    {
        // $file = '/Invoicing/Invoices/'.$invoice->issued_on->format('Y').'/'.$invoice->filename;

        if ($invoice->is_external) {
            $document = Document::find($invoice->document_id);
            if (!$document) {
                abort(404, 'Document not found');
            }
            $media = $document->firstMedia('file');
            if (!$media) {
                abort(404, 'Document file not found');
            }
            return response()->streamDownload(
                function () use ($media) {
                    $stream = $media->stream();
                    while ($bytes = $stream->read(1024)) {
                        echo $bytes;
                    }
                },
                $document->filename,
                [
                    'Content-Type' => $media->mime_type,
                    'Content-Length' => $media->size
                ]
            );
        }

        $pdfFile = Invoice::createOrGetPdf($invoice, false);

        return response()->file($pdfFile);
    }

    public function history(Invoice $invoice): Response
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
            ->loadSum('payable', 'amount')
            ->load('payable.transaction')
            ->load('notables.creator');

        return Inertia::render('App/Invoice/InvoiceHistory', [
            'invoice' => InvoiceData::from($invoice),
        ]);
    }

    public function createBooking(Invoice $invoice): RedirectResponse
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

    public function addOnAccountInvoice(Invoice $invoice): Modal
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

    public function storeOnAccountInvoice(Request $request, Invoice $invoice): RedirectResponse
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
            ->whereBetween('booked_on',
                [$invoice->issued_on->copy()->subMonths(2), $invoice->issued_on->copy()->addMonths(2)])
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

            $invoice->addHistory('Zahlungseingang vom '.$payment->issued_on->format('d.m.Y').' über '.number_format($payment->amount, 2, ',', '.').' EUR wurde verrechnet.', 'paid');


            if ($transaction->remaining_amount > 0) {
                $payment->save();
            }
        });

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function addExternalInvoice(): Response
    {

        $documentIds = Invoice::whereNotNull('document_id')->pluck('document_id') ?? [];

        $documents = Document::where('document_type_id', 12)
            ->with('contact')
            ->whereNotIn('id', $documentIds)
            ->with('project')
            ->orderBy('issued_on')
            ->paginate();

        return Inertia::render('App/Invoice/InvoiceAddExternalInvoice')
            ->with([
                'documents' => DocumentData::collect($documents),
            ]);
    }

    public function createExternalInvoice(Document $document): Response
    {

        $document->load('contact');

        $invoiceTypes = InvoiceType::query()->orderBy('is_default', 'DESC')->orderBy('display_name')->get();
        $paymentDeadlines = PaymentDeadline::query()->orderBy('is_default', 'DESC')->orderBy('name')->get();
        $taxes = Tax::query()->with('rates')->orderBy('is_default', 'DESC')->orderBy('name')->get();

        $counter = Invoice::whereYear('issued_on', $document->issued_on->year)->max('invoice_number');
        if ($counter == 0) {
            $counter = $document->issued_on->year * 100000;
        }

        $counter++;

        // Create new invoice with default values from loaded collections
        $invoice = new Invoice;
        $invoice->contact_id = $document->contact_id;
        $invoice->type_id = $invoiceTypes->first()?->id ?? 0;
        $invoice->is_draft = false;
        $invoice->issued_on = $document->issued_on;
        $invoice->invoice_contact_id = 0;
        $invoice->project_id = $document->project_id ?? 0;
        $invoice->payment_deadline_id = $document->contact->payment_deadline_id ?? $paymentDeadlines->first()?->id ?? 0;
        $invoice->tax_id = $document->contact->tax_id ?? $taxes->first()?->id ?? 0;
        $invoice->is_recurring = false;
        $invoice->recurring_interval_days = 0;
        $invoice->invoice_number = $counter;
        $invoice->document_id = $document->id;
        $invoice->is_external = true;

        return Inertia::render('App/Invoice/InvoiceCreateExternal')
            ->with([
                'invoice' => InvoiceData::from($invoice),
                'taxes' => TaxData::collect($taxes),
                'payment_deadlines' => PaymentDeadlineData::collect($paymentDeadlines),
                'document' => DocumentData::from($document),
            ]);

    }

    public function storeExternalInvoice(InvoiceStoreExternalRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('amount');

        $tax = Tax::findOrFail($request->validated('tax_id'));

        $taxRate = TaxRate::findOrFail($tax->default_rate_id);
        $invoice = Invoice::create($data);
        $invoice->lines()->create([
            'pos' => 1,
            'type_id' => 3,
            'text' => 'Externe Rechnung',
            'amount' => $request->validated('amount'),
            'tax_id' => $tax->id,
            'tax' => $request->validated('amount') / 100 * $taxRate->rate,
            'tax_rate_id' => $taxRate->id
        ]);

        $invoice->setDueDate();
        $invoice->sent_at = $invoice->issued_on;
        $invoice->save();

        Invoice::createBooking($invoice);

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function createReport(InvoiceReportRequest $request): BinaryFileResponse
    {
        $invoices = Invoice::query()
            ->where('is_draft', false)
            ->with('invoice_contact')
            ->with('contact')
            ->with('project')
            ->with('payment_deadline')
            ->with('parent_invoice')
            ->with('offer')
            ->with('type')
            ->with([
                'lines' => function ($query) {
                    $query->with('linked_invoice')->with('rate')->orderBy('pos')->orderBy('id');
                },
            ])
            ->with('booking')
            ->with('tax')
            ->with('tax.rates')
            ->withSum('lines', 'amount')
            ->withSum('lines', 'tax')
            ->withSum('payable', 'amount')
            ->with([
                'payable' => function ($query) {
                    $query->orderBy('issued_on', 'asc');
                }
            ])
            ->with('payable.transaction')
            ->whereBetween('issued_on', [$request->validated('begin_on'), $request->validated('end_on')])
            ->orderBy('issued_on', 'asc')
            ->get();

        $pdf = WeasyPdfService::createPdf('receipt-report', 'pdf.invoice.report',
            [
                'invoices' => $invoices,
                'begin_on' => $request->validated('begin_on'),
                'end_on' => $request->validated('end_on'),
                'with_payments' => $request->validated('with_payments'),
            ]);
        $filename = now()->format('Y-m-d-H-i').'-Auswertung-Ausgangsrechnungen.pdf';

        return response()->inlineFile($pdf, $filename);
    }

    public function storeNote(NoteStoreRequest $request, Invoice $invoice): RedirectResponse {
        $invoice->addNote($request->validated('note'), auth()->user());
        return redirect()->back();
    }

    public function deleteLine(Invoice $invoice, InvoiceLine $invoiceLine)
    {
        if ($invoiceLine->invoice_id === $invoice->id) {
            $invoiceLine->delete();
        }

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }
}
