<?php
/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Contact;

use App\Data\ContactData;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use Inertia\Inertia;

class ContactDetailsController extends Controller
{
    public function __invoke(Contact $contact)
    {
        $contact
            ->load(['company', 'salutation', 'title', 'favorites'])
            ->load(['mails' => function ($query) {
                $query->orderBy('pos');
            }]);

        return Inertia::render('App/Contact/ContactDetails', [
            'contact' => ContactData::from($contact),
        ]);
    }
}
