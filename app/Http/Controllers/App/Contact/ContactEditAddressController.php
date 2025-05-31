<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Contact;

use App\Data\AddressCategoryData;
use App\Data\ContactAddressData;
use App\Data\CountryData;
use App\Http\Controllers\Controller;
use App\Models\AddressCategory;
use App\Models\Contact;
use App\Models\ContactAddress;
use App\Models\Country;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class ContactEditAddressController extends Controller
{
    public function __invoke(Request $request, Contact $contact, ContactAddress $address)
    {
        $countries = Country::orderBy('name')->get();
        $categories = AddressCategory::all();

        return Inertia::modal('App/Contact/ContactEditAddress', [
            'address' => ContactAddressData::from($address),
            'categories' => AddressCategoryData::collect($categories),
            'countries' => CountryData::collect($countries),
        ])->baseRoute('app.contact.details', ['contact' => $contact->id]);

    }
}
