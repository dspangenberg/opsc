<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Contact;

use App\Data\ContactData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ContactUpdateRequest;
use App\Models\Contact;
use App\Models\ContactMail;
use App\Models\ContactPhone;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ContactUpdateController extends Controller
{
    /**
     * @throws \Throwable
     */
    public function __invoke(ContactUpdateRequest $request, Contact $contact)
    {
        DB::transaction(function () use ($request, $contact) {
            // Basis-Kontaktdaten aktualisieren
            $contactData = $request->except(['mails','phones']);
            $contact->update($contactData);

            // E-Mail-Adressen verwalten
            if ($request->has('mails')) {
                $this->updateContactMails($contact, $request->input('mails', []));
            }

            if ($request->has('phones')) {
                $this->updateContactPhones($contact, $request->input('phones', []));
            }

        });

        // Kontakt mit aktuellen Relationen neu laden
        $contact->load(['mails', 'title', 'salutation', 'addresses', 'phones']);

        return Inertia::render('App/Contact/ContactDetails', [
            'contact' => ContactData::from($contact)
        ]);
    }

    private function updateContactMails(Contact $contact, array $mailsData): void
    {
        // Sammle alle IDs aus den eingehenden Daten
        $incomingIds = collect($mailsData)
            ->pluck('id')
            ->filter()
            ->toArray();

        // Lösche E-Mails, die nicht mehr in den Daten enthalten sind
        if (!empty($incomingIds)) {
            $contact->mails()
                ->whereNotIn('id', $incomingIds)
                ->delete();
        } else {
            // Wenn keine IDs vorhanden sind, lösche alle bestehenden E-Mails
            $contact->mails()->delete();
        }

        // Erstelle oder aktualisiere E-Mails
        foreach ($mailsData as $index => $mailData) {
            $mailAttributes = [
                'contact_id' => $contact->id,
                'email' => $mailData['email'],
                'email_category_id' => $mailData['email_category_id'],
                'pos' => $mailData['pos'] ?? $index,
            ];

            if (!empty($mailData['id'])) {
                // Bestehende E-Mail aktualisieren
                ContactMail::where('id', $mailData['id'])
                    ->where('contact_id', $contact->id)
                    ->update($mailAttributes);
            } else {
                // Neue E-Mail erstellen
                ContactMail::create($mailAttributes);
            }
        }
    }
    private function updateContactPhones(Contact $contact, array $phonesData): void
    {
        // Sammle alle IDs aus den eingehenden Daten

        $incomingIds = collect($phonesData)
            ->pluck('id')
            ->filter()
            ->toArray();

        // Lösche E-Mails, die nicht mehr in den Daten enthalten sind
        if (!empty($incomingIds)) {
            $contact->phones()
                ->whereNotIn('id', $incomingIds)
                ->delete();
        } else {
            // Wenn keine IDs vorhanden sind, lösche alle bestehenden E-Mails
            $contact->phones()->delete();
        }

        // Erstelle oder aktualisiere E-Mails
        foreach ($phonesData as $index => $phoneData) {
            $phoneAttributes = [
                'contact_id' => $contact->id,
                'phone' => $phoneData['phone'],
                'phone_category_id' => $phoneData['phone_category_id'] ?? [''],
                'pos' => $mailData['pos'] ?? $index,
            ];

            if (!empty($phoneData['id'])) {
                // Bestehende E-Mail aktualisieren
                ContactPhone::where('id', $phoneData['id'])
                    ->where('contact_id', $contact->id)
                    ->update($phoneAttributes);
            } else {
                // Neue E-Mail erstellen
                ContactPhone::create($phoneAttributes);
            }
        }
    }
}
