<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Contact;

use App\Data\ContactData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ContactStoreRequest;
use App\Models\Contact;
use App\Models\Invoice;
use Inertia\Inertia;

class ContactStoreController extends Controller
{
    public function __invoke(ContactStoreRequest $request)
    {
        $request->validated();  
        $contact = new Contact;

        if ($request->validated('is_org')) {
            $contact->is_org = true;
            $contact->salutation_id = null;
            $contact->title_id = null;
            $contact->name = $request->validated('name');
        } else {
            $contact->is_org = false;
            $contact->salutation_id = $request->validated('salutation_id');
            $contact->title_id = $request->validated('title_id');
            $contact->name = $request->validated('name');
            $contact->first_name = $request->validated('first_name');
        }

        $contact->save();

        return Inertia::render('App/Contact/ContactDetails', [
            'contact' => ContactData::from($contact)
        ]);
    }
}
