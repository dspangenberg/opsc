<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Contact;

use App\Data\AddressCategoryData;
use App\Data\BookkeepingAccountData;
use App\Data\ContactAddressData;
use App\Data\ContactData;
use App\Data\CountryData;
use App\Data\EmailCategoryData;
use App\Data\PaymentDeadlineData;
use App\Data\PhoneCategoryData;
use App\Data\SalutationData;
use App\Data\TaxData;
use App\Data\TitleData;
use App\Http\Controllers\Controller;
use App\Models\AddressCategory;
use App\Models\BookkeepingAccount;
use App\Models\Contact;
use App\Models\ContactAddress;
use App\Models\Country;
use App\Models\EmailCategory;
use App\Models\PaymentDeadline;
use App\Models\PhoneCategory;
use App\Models\Salutation;
use App\Models\Tax;
use App\Models\Title;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class ContactEditController extends Controller
{
    public function __invoke(Request $request, Contact $contact)
    {
        // Laden der E-Mail-Daten mit Kategorie-Relation
        $contact->load(['mails.category', 'salutation', 'title', 'payment_deadline','phones.category']);

        $countries = Country::orderBy('name')->get();
        $categories = AddressCategory::all();
        $countries = Country::orderBy('name')->get();
        $payment_deadlines = PaymentDeadline::query()->orderBy('name')->get();
        $taxes = Tax::orderBy('name')->get();
        $salutations = Salutation::query()->whereNot('is_hidden', true)->orderBy('name')->get();
        $titles = Title::query()->orderBy('name')->get();
        $phone_categories = PhoneCategory::orderBy('name')->get();
        $bookkeeping_accounts = BookkeepingAccount::orderBy('account_number')->get();

        // Korrektur: EmailCategory statt EMailCategory
        $mail_categories = EmailCategory::orderBy('name')->get();

        return Inertia::modal('App/Contact/ContactEdit', [
            'contact' => ContactData::from($contact),
            'countries' => CountryData::collect($countries),
            'payment_deadlines' => PaymentDeadlineData::collect($payment_deadlines),
            'taxes' => TaxData::collect($taxes),
            'salutations' => SalutationData::collect($salutations),
            'titles' => TitleData::collect($titles),
            'mail_categories' => EmailCategoryData::collect($mail_categories),
            'phone_categories' => PhoneCategoryData::collect($phone_categories),
            'bookkeeping_accounts' => BookkeepingAccountData::collect($bookkeeping_accounts),
        ])->baseRoute('app.contact.details', ['contact' => $contact->id]);
    }
}
