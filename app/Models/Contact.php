<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Models;

use App\Exceptions\ContactNotFoundException;
use App\Exceptions\ContactWithoutAccountException;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Maize\Markable\Mark;
use Maize\Markable\Markable;
use Maize\Markable\Models\Favorite;
use MohamedSaid\Notable\Traits\HasNotables;
use Plank\Mediable\MediableCollection;

/**
 * @property-read Collection<int, ContactAddress> $addresses
 * @property-read int|null $addresses_count
 * @property-read Contact|null $company
 * @property-read Collection<int, Contact> $contacts
 * @property-read int|null $contacts_count
 * @property-read string $company_name
 * @property-read string|null $formated_creditor_number
 * @property-read string|null $formated_debtor_number
 * @property-read string $full_name
 * @property-read string $initials
 * @property-read bool $is_favorite
 * @property-read string $primary_mail
 * @property-read string $reverse_full_name
 * @property-read array $sales
 * @property-read MediableCollection<int, Invoice> $invoices
 * @property-read int|null $invoices_count
 * @property-read Collection<int, ContactMail> $mails
 * @property-read int|null $mails_count
 * @property-read PaymentDeadline|null $payment_deadline
 * @property-read Collection<int, ContactPhone> $phones
 * @property-read int|null $phones_count
 * @property-read Collection<int, Project> $projects
 * @property-read int|null $projects_count
 * @property-read Salutation|null $salutation
 * @property-read Tax|null $tax
 * @property-read Title|null $title
 * @method static Builder<static>|Contact newModelQuery()
 * @method static Builder<static>|Contact newQuery()
 * @method static Builder<static>|Contact query()
 * @method static Builder<static>|Contact view($view)
 * @method static Builder<static>|Contact whereHasMark(Mark $mark, Model $user, ?string $value = null)
 * @property-read string $primary_phone
 * @mixin Eloquent
 */
class Contact extends Model
{
    use Markable, HasNotables;

    protected static array $marks = [
        Favorite::class,
    ];

    protected $appends = [
        'full_name',
        'reverse_full_name',
        'is_favorite',
        'initials',
        'formated_debtor_number',
        'formated_creditor_number',
        'primary_mail',
        'primary_phone',
        'company_name',
        'sales',
    ];

    protected $attributes = [
        'name' => '',
        'first_name' => '',
        'position' => '',
        'company_id' => 0,
        'department' => '',
        'short_name' => '',
        'is_org' => false,
        'is_debtor' => false,
        'is_creditor' => false,
        'is_archived' => false,
        'has_dunning_block' => false,
        'payment_deadline_id' => 0,
        'tax_id' => 0,
        'hourly' => 0,
        'register_court' => '',
        'outturn_account_id' => 0,
        'is_primary' => false,
        'register_number' => '',
        'vat_id' => '',
        'website' => '',
        'dob' => null,
        'archived_reason' => '',
        'deleted_at' => null,
    ];

    protected $fillable = [
        'company_id',
        'is_org',
        'name',
        'title_id',
        'salutation_id',
        'first_name',
        'position',
        'department',
        'receipts_ref',
        'iban',
        'cc_name',
        'short_name',
        'ref',
        'catgory_id',
        'is_debtor',
        'is_creditor',
        'note',
        'outturn_account_id',
        'is_primary',
        'creditor_number',
        'debtor_number',
        'is_archived',
        'archived_reason',
        'has_dunning_block',
        'payment_deadline_id',
        'tax_id',
        'hourly',
        'register_court',
        'register_number',
        'vat_id',
        'tax_number',
        'cost_center_id',
        'website',
        'dob',
    ];

    public function getFullNameAttribute(): string
    {
        if ($this->first_name) {
            $title = $this->title ? $this->title->name : '';

            return trim("$title $this->first_name $this->name");
        }

        return $this->name;
    }

    public function getCompanyNameAttribute(): string
    {
        if ($this->company) {
            return $this->company->name;
        }

        return '';
    }

    public function getIsFavoriteAttribute(): bool
    {
        return Favorite::has($this, auth()->user());
    }

    public function getFormatedDebtorNumberAttribute(): ?string
    {
        if (! $this->debtor_number) {
            return null;
        }

        return number_format($this->debtor_number, 0, '', '.');
    }

    public function getFormatedCreditorNumberAttribute(): ?string
    {
        if (! $this->creditor_number) {
            return null;
        }

        return number_format($this->creditor_number, 0, '', '.');
    }

    public function getPrimaryMailAttribute(): string
    {
        if (count($this->mails)) {
            return $this->mails[0]['email'];
        }

        return '';
    }

    public function getPrimaryPhoneAttribute(): string
    {
        if (count($this->phones)) {
            return $this->phones[0]['phone'];
        }

        return '';
    }

    public function getInitialsAttribute(): string
    {
        if ($this->first_name) {
            return strtoupper(substr($this->first_name, 0, 1).substr($this->name, 0, 1));
        }

        $parts = explode(' ', $this->name);
        $initials = substr($parts[0], 0, 1);

        if (count($parts) > 1) {
            $stoppWords = ['gmbh', 'ag', 'gbr', 'eg', 'kg', 'e.k.', 'e. k.', 'ug', 'ggmbh'];

            if (! in_array(strtolower($parts[1]), $stoppWords)) {
                $initials .= substr($parts[1], 0, 1);
            }

        }

        return strtoupper($initials);
    }

    public function getReverseFullNameAttribute(): string
    {
        if ($this->first_name) {
            $title = $this->title ? $this->title->name : '';

            return "$this->name, $this->first_name $title";
        }

        return $this->name;
    }

    public function company(): HasOne
    {
        return $this->hasOne(Contact::class, 'id', 'company_id');
    }

    public function title(): HasOne
    {
        return $this->hasOne(Title::class, 'id', 'title_id');
    }

    public function cost_center(): HasOne
    {
        return $this->hasOne(CostCenter::class, 'id', 'cost_center_id');
    }

    public function salutation(): HasOne
    {
        return $this->hasOne(Salutation::class, 'id', 'salutation_id');
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class, 'company_id', 'id');
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(ContactAddress::class, 'contact_id', 'id');
    }

    public function phones(): HasMany
    {
        return $this->hasMany(ContactPhone::class, 'contact_id', 'id');
    }

    public function mails(): HasMany
    {
        return $this->hasMany(ContactMail::class, 'contact_id', 'id');
    }

    public function payment_deadline(): HasOne
    {
        return $this->hasOne(PaymentDeadline::class, 'id', 'payment_deadline_id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class, 'id', 'contact_id');
    }

    public function tax(): HasOne
    {
        return $this->hasOne(Tax::class, 'id', 'tax_id');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'owner_contact_id', 'id');
    }

    public function scopeSearch($query, $search): Builder {
        $search = trim($search);
        if ($search) {
            $query
                ->where('name', 'like', "%$search%")
                ->orWhere('first_name', 'like', "%$search%")
                ->orWhereRelation('company', 'name', 'like', "%$search%");
        }
        return $query;
    }

    public function scopeView(Builder $query, $view): Builder
    {
        if ($view != 'archived') {
            $query->where('is_archived', false);
        }

        return match ($view) {
            'debtors' => $query->where('is_debtor', true)->orWhere('debtor_number', '<>', 0),
            'orgs' => $query->where('is_org', true),
            'creditors' => $query->where('is_creditor', true)->orWhere('creditor_number', '<>', 0),
            'archived' => $query->where('is_archived', true),
            'favorites' => $query->whereHasFavorite(
                auth()->user()
            ),
            'all' => $query->where('is_archived', false),
            default => $query,
        };
    }

    protected function casts(): array
    {
        return [
            'is_org' => 'boolean',
            'is_debtor' => 'boolean',
            'is_creditor' => 'boolean',
            'is_primary' => 'boolean',
            'is_archived' => 'boolean',
            'has_dunning_block' => 'boolean',
            'dob' => 'datetime',
        ];
    }

    public function createBookkeepingAccount($isDebtor = true) {

        $accountNumber = $isDebtor ? $this->debtor_number : $this->creditor_number;
        $account = BookkeepingAccount::where('account_number', $accountNumber)->first();
        if ($account) {
            return $account;
        }

        $bookkeepingAccount = new BookkeepingAccount;
        $bookkeepingAccount->account_number = $accountNumber;
        $bookkeepingAccount->name = $this->full_name;
        $bookkeepingAccount->type = $isDebtor ? 'd' : 'c';
        $bookkeepingAccount->save();
        return $bookkeepingAccount;
    }

    public static function getAccounts(bool $is_invoice, int $id, bool $createAccountIfNotExists = true, bool $getDefaultOutturnAccount = false): array
    {
        $contact = static::find($id);



        if ($contact === null) {
            return [
                'subledgerAccount' => null,
                'outturnAccount' => null,
                'name' => null,
            ];
        }

        if ($contact->company_id) {
            $contact = static::find($contact->company_id);
        }

        if (! $contact) {
            throw new ContactNotFoundException;
        }

        if ($contact->is_debtor && ! $contact->debtor_number) {
            throw new ContactWithoutAccountException;
        }

        $accountNumber = $is_invoice ? $contact->debtor_number : $contact->creditor_number;
        $bookkeepingAccount = BookkeepingAccount::where('account_number', $accountNumber)->first();

        if (! $bookkeepingAccount || ! $accountNumber) {
            if (! $createAccountIfNotExists) {
                throw new ContactWithoutAccountException;
            } else {
                if ($accountNumber) {
                    $bookkeepingAccount = new BookkeepingAccount;
                    $bookkeepingAccount->account_number = $accountNumber;
                    $bookkeepingAccount->name = $contact->full_name;
                    $bookkeepingAccount->type = $contact->is_creditor ? 'c' : 'd';
                    $bookkeepingAccount->save();
                }
            }
        }

        $outturnAccount = null;

        if (!$is_invoice) {
            $contact->load('cost_center');
            if ($contact->cost_center_id && !$contact->is_primary) {
                $outturnAccount = BookkeepingAccount::where('id', $contact->cost_center->bookkeeping_account_id)->first();
            } else {
                if ($contact->outturn_account_id) {
                    $outturnAccount = BookkeepingAccount::where('account_number', $contact->outturn_account_id)->first();
                }
            }
        } else {
            if ($contact->outturn_account_id === 0 && $getDefaultOutturnAccount === true) {
                $outturnAccount = BookkeepingAccount::query()->where('type', 'r')->where('is_default', true)->first();
            }

            $outturnAccount = $contact->outturn_account_id
                ? BookkeepingAccount::query()->where('account_number', $contact->outturn_account_id)->first()
                : $outturnAccount; //

        }


        return [
            'subledgerAccount' => $bookkeepingAccount,
            'outturnAccount' => $outturnAccount,
            'name' => $contact->short_name ? $contact->short_name : $contact->full_name,
        ];
    }

    public function getSalesAttribute(): array
    {
        if (! $this->debtor_number) {
            return ['currentYear' => 0, 'allTime' => 0];
        }

        $sales = ['currentYear' => 0, 'allTime' => 0];
        $invoices = Invoice::query()
            ->where('contact_id', $this->id)
            ->withSum('lines', 'amount')
            ->get();

        foreach ($invoices as $invoice) {
            if ($invoice->issued_on->year === now()->year) {
                $sales['currentYear'] += $invoice->lines_sum_amount;
            }
            $sales['allTime'] += $invoice->lines_sum_amount;
        }

        return $sales;
    }
}
