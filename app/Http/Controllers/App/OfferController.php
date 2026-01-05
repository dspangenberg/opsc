<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App;

use App\Data\ContactData;
use App\Data\InvoiceData;
use App\Data\InvoiceTypeData;
use App\Data\OfferData;
use App\Data\PaymentDeadlineData;
use App\Data\ProjectData;
use App\Data\TaxData;
use App\Data\TextModuleData;
use App\Http\Controllers\Controller;
use App\Http\Requests\InvoiceDetailsBaseUpdateRequest;
use App\Http\Requests\OfferStoreRequest;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use App\Models\InvoiceType;
use App\Models\Offer;
use App\Models\Project;
use App\Models\Tax;
use App\Models\TextModule;
use App\Models\Time;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Mpdf\MpdfException;
use Spatie\TemporaryDirectory\Exceptions\PathAlreadyExists;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $years = Offer::query()->selectRaw('DISTINCT YEAR(issued_on) as year')->orderByRaw('YEAR(issued_on) DESC')->get()->pluck('year');
        $currentYear = date('Y');

        $year = $request->query('year');
        if ($year === null) {
            $year = $currentYear;
        }

        if ($year && ! $years->contains($year)) {
            $years->push($year);
        }

        $view = $request->query('view', 'all');

        $offers = Offer::query()
            ->with(['contact', 'project'])
            ->withSum('lines', 'amount')
            ->withSum('lines', 'tax')
            ->byYear($year)
            ->orderBy('issued_on', 'desc')
            ->orderBy('offer_number', 'desc')
            ->paginate(15);

        $offers->appends($_GET)->links();

        return Inertia::render('App/Offer/OfferIndex', [
            'offers' => OfferData::collect($offers),
            'years' => $years,
            'currentYear' => $year,
        ]);
    }

    public function create()
    {
        // Load all data in single queries, ordered appropriately for defaults
        $taxes = Tax::query()->with('rates')->orderBy('is_default', 'DESC')->orderBy('name')->get();
        $projects = Project::query()->where('is_archived', false)->orderBy('name')->get();
        $contacts = Contact::query()->whereNotNull('debtor_number')->orderBy('name')->orderBy('first_name')->get();

        // Create new offer with default values from loaded collections
        $offer = new Offer;
        $offer->contact_id = 0;
        $offer->is_draft = true;
        $offer->issued_on = now();
        $offer->project_id = 0;
        $offer->tax_id = $taxes->first()?->id ?? 0;
        $offer->offer_number = null;

        return Inertia::modal('App/Offer/OfferCreate')
            ->with([
                'offer' => OfferData::from($offer),
                'projects' => ProjectData::collect($projects),
                'taxes' => TaxData::collect($taxes),
                'contacts' => ContactData::collect($contacts),
            ])->baseRoute('app.offer.index');
    }

    public function store(OfferStoreRequest $request)
    {
        $validatedData = $request->validated();

        $validatedData['offer_number'] = null;
        $offer = Offer::create($validatedData);
        $offer->load('contact');

        $offer->address = $offer->contact->getInvoiceAddress()->full_address;
        $offer->save();


        return redirect()->route('app.offer.details', ['offer' => $offer->id]);
    }

    public function show(Offer $offer)
    {
        $offer
            ->load('contact')
            ->load('project')
            ->load([
                'lines' => function ($query) {
                    $query->orderBy('pos')->orderBy('id');
                },
            ])
            ->load('tax')
            ->load('tax.rates')
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');


        return Inertia::render('App/Offer/OfferDetails', [
            'offer' => OfferData::from($offer),
        ]);
    }

    public function edit(Request $request, Invoice $invoice)
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

        return Inertia::modal('App/Invoice/InvoiceDetailsEditBaseData')
            ->with([
                'invoice' => InvoiceData::from($invoice),
                'invoice_types' => InvoiceTypeData::collect($invoiceTypes),
                'projects' => ProjectData::collect($projects),
                'taxes' => TaxData::collect($taxes),
            ])->baseRoute('app.invoice.details', [
                'invoice' => $invoice->id,
            ]);
    }

    public function update(InvoiceDetailsBaseUpdateRequest $request, Invoice $invoice)
    {
        if ($request->validated('project_id') === -1) {
            $invoice->project_id = 0;
            $invoice->save();
        }

        $invoice->update($request->validated());

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function updateLines(Request $request, Offer $offer)
    {
        $validatedLines = $request->lines;

        // Simply pass the validated array data to updatePositions
        // The model will handle the data as arrays, not DTOs
        $offer->updatePositions($validatedLines);

        return redirect()->route('app.offer.details', ['offer' => $offer->id]);
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
        $duplicatedInvoice = $invoice->replicate();

        $duplicatedInvoice->issued_on = Carbon::now()->format('Y-m-d');
        $duplicatedInvoice->is_draft = 1;
        $duplicatedInvoice->invoice_number = null;
        $duplicatedInvoice->number_range_document_numbers_id = null;
        $duplicatedInvoice->sent_at = null;
        $duplicatedInvoice->save();

        $invoice->lines()->each(function ($line) use ($duplicatedInvoice) {
            $replicatedLine = $line->replicate();
            $replicatedLine->invoice_id = $duplicatedInvoice->id;
            $replicatedLine->save();
        });

        return redirect()->route('app.invoice.details', ['invoice' => $duplicatedInvoice->id]);
    }

    /**
     * @throws MpdfException
     * @throws PathAlreadyExists
     */
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
        $invoice->save();

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    public function markAsSent(Invoice $invoice)
    {
        if (! $invoice->sent_at) {
            $invoice->sent_at = now();
            $invoice->save();

            Invoice::createBooking($invoice);
        }

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }

    /**
     * @throws MpdfException
     * @throws PathAlreadyExists
     */
    public function downloadPdf(Offer $offer): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $file = '/Invoicing/Invoices/'.$offer->issued_on->format('Y').'/'.$offer->filename;

        $pdfFile = Offer::createOrGetPdf($offer, false);

        return response()->file($pdfFile);

        abort(404);
    }

    public function terms(Offer $offer, ?int $line = null)
    {
        $textModules = TextModule::orderBy('title')->get();

        $offer
            ->load('contact')
            ->load('project')
            ->load([
                'lines' => function ($query) {
                    $query->orderBy('pos');
                },
            ])
            ->load('tax')
            ->load('tax.rates')
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');

        return Inertia::render('App/Offer/OfferTerms', [
            'offer' => OfferData::from($offer),
            'textModules' => TextModuleData::collect($textModules),
        ]);
    }
    public function history(Offer $offer, ?int $line = null)
    {
        $offer
            ->load('contact')
            ->load('project')
            ->load([
                'lines' => function ($query) {
                    $query->orderBy('pos');
                },
            ])
            ->load('tax')
            ->load('tax.rates')
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');

        return Inertia::render('App/Offer/OfferHistory', [
            'offer' => OfferData::from($offer),
        ]);
    }
}
