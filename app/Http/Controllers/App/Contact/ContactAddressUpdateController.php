<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactAddressRequest;
use App\Models\Contact;
use App\Models\ContactAddress;

class ContactAddressUpdateController extends Controller
{
    public function __invoke(ContactAddressRequest $request, Contact $contact, ContactAddress $contact_address)
    {
        $contact_address->update($request->validated());
        return redirect()->route('app.contact.details', ['contact' => $contact->id]);
    }
}
