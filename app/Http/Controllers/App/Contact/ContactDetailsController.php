<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Contact;

use App\Data\ContactData;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Invoice;
use Inertia\Inertia;

class ContactDetailsController extends Controller
{
    public function __invoke(Contact $contact)
    {
        $contact->load([
            'salutation',
            'title',
            'favorites',
            'payment_deadline',
            'company' => function ($query) {
                $query->with([
                    'mails' => function ($query) {
                        $query->orderBy('pos')->with('category');
                    },
                    'addresses' => function ($query) {
                        $query->with(['category', 'country']);
                    },
                ]);
            },
            'mails' => function ($query) {
                $query->orderBy('pos')->with('category');
            },
            'addresses' => function ($query) {
                $query->with(['category', 'country']);
            },
            'contacts' => function ($query) {
                $query->with('contacts');
            }
        ]);

        if ($contact->debtor_number) {
            $sales = ['currentYear' => 0, 'allTime' => 0];
            $invoices = Invoice::query()->where('contact_id', $contact->id)->withSum('lines', 'amount')->get();
            $invoicesCollection = collect($invoices);

            $invoicesCollection->each(function ($invoice) use ($sales) {
                if ($invoice->issued_on->year === now()->year) {
                    $sales['currentYear'] += $invoice->lines_sum_amount;
                }
                $sales['allTime'] += $invoice->lines_sum_amount;
            });
        }

        $contact->sales = $sales ?? null;


        return Inertia::render('App/Contact/ContactDetails', [
            'contact' => ContactData::from($contact)
        ]);
    }
}
