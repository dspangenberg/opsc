<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Contact;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactAddressRequest;
use App\Models\ContactAddress;

class ContactAddressStoreController extends Controller
{
    public function __invoke(ContactAddressRequest $request)
    {
        $validatedData = $request->validated();

        ContactAddress::create($validatedData);
        return redirect()->route('app.contact.details', ['contact' => $validatedData['contact_id']]);
    }
}
