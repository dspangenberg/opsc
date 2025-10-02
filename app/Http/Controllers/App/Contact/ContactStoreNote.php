<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Contact;
use App\Http\Controllers\Controller;
use App\Http\Requests\NoteStoreRequest;
use App\Models\Contact;
use Stevebauman\Purify\Facades\Purify;

class ContactStoreNote extends Controller
{
    public function __invoke(NoteStoreRequest $request, Contact $contact)
    {

        $contact->addNote(Purify::clean($request->validated('note')), auth()->user());

        return redirect()->route('app.contact.details', ['contact' => $contact->id]);
    }
}
