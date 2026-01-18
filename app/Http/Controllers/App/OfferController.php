<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App;

use App\Data\ContactData;
use App\Data\OfferData;
use App\Data\OfferSectionData;
use App\Data\ProjectData;
use App\Data\TaxData;
use App\Data\TextModuleData;
use App\Http\Controllers\Controller;
use App\Http\Requests\OfferAttachmentSortUpdateRequest;
use App\Http\Requests\OfferStoreRequest;
use App\Http\Requests\OfferTermsRequest;
use App\Models\Attachment;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use App\Models\Offer;
use App\Models\OfferLine;
use App\Models\OfferSection;
use App\Models\Project;
use App\Models\Tax;
use App\Models\TextModule;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Requests\OfferAttachmentAddRequest;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

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

        if ($year && !$years->contains($year)) {
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
        $taxes = Tax::query()->with('rates')->orderBy('is_default', 'DESC')->orderBy('name')->get();
        $projects = Project::query()->where('is_archived', false)->orderBy('name')->get();
        $contacts = Contact::query()->whereNotNull('debtor_number')->orderBy('name')->orderBy('first_name')->get();

        $offer = new Offer;
        $offer->contact_id = 0;
        $offer->is_draft = true;
        $offer->issued_on = now();
        $offer->project_id = 0;
        $offer->tax_id = $taxes->first()?->id ?? 0;
        $offer->offer_number = null;

        return Inertia::modal('App/Offer/OfferEdit')
            ->with([
                'offer' => OfferData::from($offer),
                'projects' => ProjectData::collect($projects),
                'taxes' => TaxData::collect($taxes),
                'contacts' => ContactData::collect($contacts),
            ])->baseRoute('app.offer.index');
    }

    public function edit(Offer $offer)
    {
        $taxes = Tax::query()->with('rates')->orderBy('is_default', 'DESC')->orderBy('name')->get();
        $projects = Project::query()->where('is_archived', false)->orderBy('name')->get();
        $contacts = Contact::query()->whereNotNull('debtor_number')->orderBy('name')->orderBy('first_name')->get();

        return Inertia::modal('App/Offer/OfferEdit')
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


    public function createInvoice(Offer $offer) {
        $offer->load('contact', 'lines');

        $invoice = new Invoice;
        $invoice->issued_on = Carbon::now()->format('Y-m-d');
        $invoice->is_draft = 1;
        $invoice->invoice_number = null;
        $invoice->number_range_document_numbers_id = null;
        $invoice->sent_at = null;
        $invoice->contact_id = $offer->contact_id;
        $invoice->project_id = $offer->project_id;
        $invoice->type_id = 2;
        $invoice->payment_deadline_id = $offer->contact->payment_deadline_id;
        $invoice->tax_id = $offer->tax_id;
        $invoice->save();

        $invoice->load('contact');
        $invoice->address = $invoice->contact->getInvoiceAddress()->full_address;
        $invoice->save();

        $offer->lines()->each(function ($line) use ($invoice) {
            $invoiceLine = new InvoiceLine();
            $invoiceLine->invoice_id = $invoice->id;
            $invoiceLine->pos = $line->pos;
            $invoiceLine->quantity = $line->quantity;
            $invoiceLine->price = $line->price;
            $invoiceLine->type_id = $line->type_id;
            $invoiceLine->text = $line->text;
            $invoiceLine->unit = $line->unit;
            $invoiceLine->amount = $line->amount;
            $invoiceLine->tax_id = $line->tax_id;
            $invoiceLine->tax = $line->tax;
            $invoiceLine->save();
        });


        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);

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
            ->load([
                'attachments' => function ($query) {
                    $query->with('document')->orderBy('pos');
                }
            ])
            ->load('tax')
            ->load('tax.rates')
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax');


        return Inertia::render('App/Offer/OfferDetails', [
            'offer' => OfferData::from($offer),
        ]);
    }

    public function update(OfferStoreRequest $request, Offer $offer)
    {
        $oldContactId = $offer->contact_id;
        if ($request->validated('project_id') === -1) {
            $offer->project_id = 0;
            $offer->save();
        }


        $offer->update($request->validated());

        if ($request->validated('contact_id') !== $oldContactId) {

            $offer->address = $offer->contact->getInvoiceAddress()->full_address;
            $offer->save();
        }

        return redirect()->route('app.offer.details', ['offer' => $offer->id]);
    }

    public function updateLines(Request $request, Offer $offer)
    {
        $validatedLines = $request->lines;
        $offer->updatePositions($validatedLines);

        return redirect()->route('app.offer.details', ['offer' => $offer->id]);
    }

    public function destroy(Offer $offer)
    {
        if ($offer->is_draft) {
            OfferLine::where('offer_id', $offer->id)->delete();
            $offer->delete();

            return redirect()->route('app.offer.index');
        }

        abort('Cannot delete a published offer');
    }

    public function duplicate(Offer $offer)
    {
        $duplicatedOffer = $offer->replicate();

        $duplicatedOffer->issued_on = Carbon::now()->format('Y-m-d');
        $duplicatedOffer->is_draft = true;
        $duplicatedOffer->offer_number = null;
        $duplicatedOffer->sent_at = null;
        $duplicatedOffer->save();

        $offer->lines()->each(function ($line) use ($duplicatedOffer) {
            $replicatedLine = $line->replicate();
            $replicatedLine->offer_id = $duplicatedOffer->id;
            $replicatedLine->save();
        });

        return redirect()->route('app.offer.details', ['offer' => $duplicatedOffer->id]);
    }

    public function release(Offer $offer)
    {
        $offer->release();
        return redirect()->route('app.offer.details', ['offer' => $offer->id]);
    }

    public function unrelease(Offer $offer)
    {
        if ($offer->sent_at) {
            abort('Offer cannot be unreleased once it has been sent.');
        }

        $offer->offer_number = null;
        $offer->is_draft = true;
        $offer->save();

        return redirect()->route('app.offer.details', ['offer' => $offer->id]);
    }

    public function markAsSent(Offer $offer)
    {
        if (!$offer->sent_at) {
            $offer->sent_at = now();
            $offer->save();
        }

        return redirect()->route('app.offer.details', ['offer' => $offer->id]);
    }

    /**
     * @throws Exception
     */
    public function downloadPdf(Offer $offer): BinaryFileResponse
    {
        $offer->load('attachments');
        $pdfFile = Offer::createOrGetPdf($offer);
        return response()->file($pdfFile);

    }

    public function terms(Offer $offer)
    {
        $textModules = TextModule::orderBy('title')->get();
        $sections = OfferSection::orderBy('pos')->get();

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
            'sections' => OfferSectionData::collect($sections),
        ]);
    }

    public function updateTerms(OfferTermsRequest $request, Offer $offer)
    {
        $offer->additional_text = $request->validated()['additional_text'];
        $offer->save();

        return redirect()->route('app.offer.terms', ['offer' => $offer->id]);
    }

    public function sortAttachments(OfferAttachmentSortUpdateRequest $request, Offer $offer)
    {
        $attachmentIds = $request->validated()['attachment_ids'];

        foreach ($attachmentIds as $index => $attachmentId) {
            Attachment::where('id', $attachmentId)
                ->where('attachable_type', Offer::class)
                ->where('attachable_id', $offer->id)
                ->update(['pos' => $index + 1]);
        }

        return back();
    }

    public function removeAttachment(Offer $offer, Attachment $attachment)
    {
        $attachment = $offer->attachments()->find($attachment->id);
        if (!$attachment) {
            return back();
        }
        $attachment->delete();

        return back();
    }

    public function addAttachments(OfferAttachmentAddRequest $request, Offer $offer)
    {
        $documentIds = $request->validated('document_ids');
        $maxPos = $offer->attachments()->max('pos') ?? 0;

        foreach ($documentIds as $index => $documentId) {
            $offer->attachments()->create([
                'document_id' => $documentId,
                'pos' => $maxPos + $index + 1
            ]);
        }

        return back();
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
