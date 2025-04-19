<?php
/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Contact;

use App\Data\ContactData;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use Inertia\Inertia;

class ContactIndexController extends Controller
{
    public function __invoke()
    {

        $contacts = Contact::query()
            ->select([
                'id', 'name', 'first_name', 'company_id', 'title_id', 'salutation_id', 'debtor_number',
                'creditor_number'
            ])
            ->with('company')
            ->with('salutation')
            ->with('title')
            ->with('favorites')
            ->with('mails', function ($query) {
                $query->orderBy('pos');
            })
            /*
            ->whereHasFavorite(
                auth()->user()
            )
            */
            ->orderBy('name')
            ->orderBy('first_name')
            ->paginate(15);


        return Inertia::render('App/Contact/ContactIndex', [
            'contacts' => ContactData::collect($contacts)
        ]);
    }
}
