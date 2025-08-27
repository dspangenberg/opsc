<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Contact;

use App\Data\ContactData;
use App\Data\SalutationData;
use App\Data\TitleData;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\Salutation;
use App\Models\Title;
use Inertia\Inertia;

class ContactCreateController extends Controller
{
    public function __invoke()
    {
        $contact = new Contact;
        $salutations = Salutation::query()->whereNot('is_hidden', true)->orderBy('name')->get();
        $titles = Title::query()->orderBy('name')->get();
        $contact->is_org = true;

        return Inertia::modal('App/Contact/ContactCreate')
            ->with([
                'contact' => ContactData::from($contact),
                'salutations' => SalutationData::collect($salutations),
                'titles' => TitleData::collect($titles),
            ])->baseRoute('app.contact.index');
    }
}
