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

class ContactDetailsPersonsController extends Controller
{
    public function __invoke(Contact $contact)
    {
        $contact->load([
            'contacts' => function ($query) {
                $query->with('title');
            }
        ]);

        return Inertia::render('App/Contact/ContactDetailsPersons', [
            'contact' => ContactData::from($contact)
        ]);
    }
}
