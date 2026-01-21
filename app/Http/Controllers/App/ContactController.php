<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App;

use App\Data\AddressCategoryData;
use App\Data\BookkeepingAccountData;
use App\Data\ContactData;
use App\Data\CostCenterData;
use App\Data\CountryData;
use App\Data\EmailCategoryData;
use App\Data\PaymentDeadlineData;
use App\Data\PhoneCategoryData;
use App\Data\SalutationData;
use App\Data\TaxData;
use App\Data\TitleData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ContactPersonStoreRequest;
use App\Http\Requests\ContactStoreRequest;
use App\Http\Requests\ContactUpdateRequest;
use App\Http\Requests\NoteStoreRequest;
use App\Models\AddressCategory;
use App\Models\BookkeepingAccount;
use App\Models\Contact;
use App\Models\ContactAddress;
use App\Models\ContactMail;
use App\Models\ContactPhone;
use App\Models\CostCenter;
use App\Models\Country;
use App\Models\EmailCategory;
use App\Models\PaymentDeadline;
use App\Models\PhoneCategory;
use App\Models\Salutation;
use App\Models\Tax;
use App\Models\Title;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maize\Markable\Models\Favorite;
use Plank\Mediable\Facades\MediaUploader;
use Stevebauman\Purify\Facades\Purify;
use Throwable;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $view = $request->input('view', 'all');
        $search = $request->input('search', '');

        $contacts = Contact::query()
            ->select([
                'id',
                'name',
                'first_name',
                'company_id',
                'title_id',
                'salutation_id',
                'debtor_number',
                'creditor_number',
            ])
            ->search($search)
            ->view($view)
            ->with('company')
            ->with('salutation')
            ->with('title')
            ->with('favorites')
            ->with(['mails' => function ($query) {
                $query->orderBy('pos');
            }])
            ->with(['phones' => function ($query) {
                $query->orderBy('pos');
            }])
            ->orderBy('name')
            ->orderBy('first_name')
            ->paginate(15);

        $contacts->appends($_GET)->links();

        return Inertia::render('App/Contact/ContactIndex', [
            'contacts' => ContactData::collect($contacts),
            'currentSearch' => $search,
        ]);
    }

    public function create()
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

    public function createPerson(Contact $company)
    {
        $contact = new Contact;
        $contact->is_org = false;
        $contact->company_id = $company->id;

        $salutations = Salutation::query()->whereNot('is_hidden', true)->orderBy('name')->get();
        $titles = Title::query()->orderBy('name')->get();

        return Inertia::modal('App/Contact/ContactCreatePerson')
            ->with([
                'contact' => ContactData::from($contact),
                'salutations' => SalutationData::collect($salutations),
                'titles' => TitleData::collect($titles),
            ])->baseRoute('app.contact.index');
    }

    public function store(ContactStoreRequest $request)
    {
        $contact = Contact::create($request->validated());
        return redirect()->route('app.contact.edit', ['contact' => $contact->id]);
    }

    public function storePerson(ContactPersonStoreRequest $request)
    {
        $request->validated();
        $contact = Contact::create($request->validated());

        return redirect()->route('app.contact.edit', ['contact' => $contact->id]);
    }

    public function archiveToggle(Contact $contact) {
        $contact->is_archived = !$contact->is_archived;
        $contact->save();

        $message = $contact->is_archived ? 'Kontakt wurde archiviert' : 'Kontakt wurde wiederhergestellt';
        return Inertia::flash('toast', ['type' => 'success', 'message' => $message])->back();
    }
    public function show(Contact $contact)
    {
        $contact->load([
            'salutation',
            'title',
            'favorites',
            'cost_center',
            'tax',
            'payment_deadline',
            'company' => function ($query) {
                $query->with([
                    'mails' => function ($query) {
                        $query->orderBy('pos')->with('category');
                    },
                    'phones' => function ($query) {
                        $query->orderBy('pos')->with('category');
                    },
                    'addresses' => function ($query) {
                        $query->with(['category', 'country']);
                    },
                ]);
            },
            'mails' => function ($query) {
                $query->orderBy('pos')->with('category');
            },
            'addresses' => function ($query) {
                $query->with(['category', 'country']);
            },
            'phones' => function ($query) {
                $query->orderBy('pos')->with(['category']);
            },
            'contacts' => function ($query) {
                $query->with('contacts');
            },
            'notables.creator',
        ]);

        return Inertia::render('App/Contact/ContactDetails', [
            'contact' => ContactData::from($contact),
        ]);
    }

    public function edit(Contact $contact)
    {
        $contact->load(['addresses', 'addresses.category', 'mails.category', 'salutation', 'title', 'payment_deadline', 'phones.category', 'cost_center']);

        $countries = Country::orderBy('name')->get();
        $categories = AddressCategory::all();
        $payment_deadlines = PaymentDeadline::query()->orderBy('name')->get();
        $taxes = Tax::orderBy('name')->get();
        $salutations = Salutation::query()->whereNot('is_hidden', true)->orderBy('name')->get();
        $titles = Title::query()->orderBy('name')->get();
        $phone_categories = PhoneCategory::orderBy('name')->get();
        $bookkeeping_accounts = BookkeepingAccount::orderBy('account_number')->get();
        $cost_centers = CostCenter::orderBy('name')->get();
        $mail_categories = EmailCategory::orderBy('name')->get();

        return Inertia::render('App/Contact/ContactEdit', [
            'contact' => ContactData::from($contact),
            'countries' => CountryData::collect($countries),
            'payment_deadlines' => PaymentDeadlineData::collect($payment_deadlines),
            'taxes' => TaxData::collect($taxes),
            'salutations' => SalutationData::collect($salutations),
            'titles' => TitleData::collect($titles),
            'mail_categories' => EmailCategoryData::collect($mail_categories),
            'address_categories' => AddressCategoryData::collect($categories),
            'phone_categories' => PhoneCategoryData::collect($phone_categories),
            'bookkeeping_accounts' => BookkeepingAccountData::collect($bookkeeping_accounts),
            'cost_centers' => CostCenterData::collect($cost_centers),
        ]);
    }

    /**
     * @throws Throwable
     */
    public function update(ContactUpdateRequest $request, Contact $contact)
    {
        DB::transaction(function () use ($request, $contact) {
            $data = $request->safe()->except('avatar', 'mails', 'phones', 'addresses');

            // Convert empty strings to appropriate values for optional foreign key fields
            if (isset($data['outturn_account_id']) && ($data['outturn_account_id'] === '' || $data['outturn_account_id'] === null)) {
                $data['outturn_account_id'] = 0; // No foreign key, use 0
            }
            if (isset($data['cost_center_id']) && ($data['cost_center_id'] === '' || $data['cost_center_id'] === 0)) {
                $data['cost_center_id'] = null; // Has foreign key, must be null if empty
            }

            $contact->update($data);

            if ($request->has('mails')) {
                $this->updateContactMails($contact, $request->input('mails', []));
            }

            if ($request->has('phones')) {
                $this->updateContactPhones($contact, $request->input('phones', []));
            }

            if ($request->has('addresses')) {
                $this->updateContactAddresses($contact, $request->input('addresses', []));
            }
        });

        if ($request->hasFile('avatar')) {
            $contact->detachMediaTags('avatar');

            $media = MediaUploader::fromSource($request->file('avatar'))
                ->toDestination('s3', 'avatars/contacts')
                ->upload();

            $contact->attachMedia($media, 'avatar');
        }

        $contact->load(['mails', 'title', 'salutation', 'addresses', 'phones']);

        if ($contact->is_creditor && ! $contact->creditor_number) {
            $contact->creditor_number = Contact::max('creditor_number') + 1;
            $contact->save();
            $contact->createBookkeepingAccount(false);
        }

        if ($contact->is_debtor && ! $contact->debtor_number) {
            $contact->debtor_number = Contact::max('debtor_number') + 1;
            $contact->save();
            $contact->createBookkeepingAccount();
        }

       return redirect(route('app.contact.details', ['contact' => $contact]));
    }

    public function persons(Contact $contact)
    {
        $contact->load([
            'contacts' => function ($query) {
                $query->with('title');
            },
        ]);

        return Inertia::render('App/Contact/ContactDetailsPersons', [
            'contact' => ContactData::from($contact),
        ]);
    }

    public function toggleFavorite(Contact $contact)
    {
        Favorite::toggle($contact, auth()->user());
    }

    public function storeNote(NoteStoreRequest $request, Contact $contact)
    {
        $contact->addNote(Purify::clean($request->validated('note')), auth()->user());

        return redirect()->route('app.contact.details', ['contact' => $contact->id]);
    }


    public function destroy(Contact $contact)
    {
        $contact->delete();
        return Inertia::flash('toast', ['type' => 'success', 'message' => 'Kontakt erfolgreich gelöscht'])->back();
    }

    private function updateContactMails(Contact $contact, array $mailsData): void
    {
        $incomingIds = collect($mailsData)
            ->pluck('id')
            ->filter()
            ->toArray();

        if (! empty($incomingIds)) {
            $contact->mails()
                ->whereNotIn('id', $incomingIds)
                ->delete();
        } else {
            $contact->mails()->delete();
        }

        foreach ($mailsData as $index => $mailData) {
            $mailAttributes = [
                'contact_id' => $contact->id,
                'email' => $mailData['email'],
                'email_category_id' => $mailData['email_category_id'],
                'pos' => $mailData['pos'] ?? $index,
            ];

            if (! empty($mailData['id'])) {
                ContactMail::where('id', $mailData['id'])
                    ->where('contact_id', $contact->id)
                    ->update($mailAttributes);
            } else {
                ContactMail::create($mailAttributes);
            }
        }
    }

    private function updateContactAddresses(Contact $contact, array $addressesData): void
    {
        $incomingIds = collect($addressesData)
            ->pluck('id')
            ->filter()
            ->toArray();

        if (! empty($incomingIds)) {
            $contact->addresses()
                ->whereNotIn('id', $incomingIds)
                ->delete();
        } else {
            $contact->addresses()->delete();
        }

        foreach ($addressesData as $addressData) {
            $addressAttributes = [
                'contact_id' => $contact->id,
                'address' => $addressData['address'],
                'zip' => $addressData['zip'],
                'city' => $addressData['city'],
                'country_id' => $addressData['country_id'],
                'address_category_id' => $addressData['address_category_id'],
            ];

            if (! empty($addressData['id'])) {
                ContactAddress::where('id', $addressData['id'])
                    ->where('contact_id', $contact->id)
                    ->update($addressAttributes);
            } else {
                ContactAddress::create($addressAttributes);
            }
        }
    }

    private function updateContactPhones(Contact $contact, array $phonesData): void
    {
        $incomingIds = collect($phonesData)
            ->pluck('id')
            ->filter()
            ->toArray();

        if (! empty($incomingIds)) {
            $contact->phones()
                ->whereNotIn('id', $incomingIds)
                ->delete();
        } else {
            $contact->phones()->delete();
        }

        foreach ($phonesData as $index => $phoneData) {
            $phoneAttributes = [
                'contact_id' => $contact->id,
                'phone' => $phoneData['phone'],
                'phone_category_id' => $phoneData['phone_category_id'],
                'pos' => $phoneData['pos'] ?? $index,
            ];

            if (! empty($phoneData['id'])) {
                ContactPhone::where('id', $phoneData['id'])
                    ->where('contact_id', $contact->id)
                    ->update($phoneAttributes);
            } else {
                ContactPhone::create($phoneAttributes);
            }
        }
    }
}
