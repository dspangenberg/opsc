<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Maize\Markable\Mark;
use Maize\Markable\Markable;
use Maize\Markable\Models\Favorite;

/**
 * 
 *
 * @property int $id
 * @property int|null $company_id
 * @property int $is_org
 * @property string $name
 * @property int|null $title_id
 * @property int|null $salutation_id
 * @property string|null $first_name
 * @property string|null $position
 * @property string|null $department
 * @property string|null $short_name
 * @property string|null $ref
 * @property int|null $catgory_id
 * @property int|null $is_debtor
 * @property int|null $is_creditor
 * @property int|null $debtor_number
 * @property int|null $creditor_number
 * @property int|null $is_archived
 * @property string|null $archived_reason
 * @property int|null $has_dunning_block
 * @property int|null $payment_deadline_id
 * @property int|null $tax_id
 * @property string|null $hourly
 * @property string|null $register_court
 * @property string|null $register_number
 * @property string|null $vat_id
 * @property string|null $website
 * @property string|null $note
 * @property string|null $dob
 * @property string|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Contact|null $company
 * @property-read string $full_name
 * @property-read string $initials
 * @property-read string $reverse_full_name
 * @property-read Title|null $title
 * @method static Builder|Contact newModelQuery()
 * @method static Builder|Contact newQuery()
 * @method static Builder|Contact query()
 * @method static Builder|Contact whereArchivedReason($value)
 * @method static Builder|Contact whereCatgoryId($value)
 * @method static Builder|Contact whereCompanyId($value)
 * @method static Builder|Contact whereCreatedAt($value)
 * @method static Builder|Contact whereCreditorNumber($value)
 * @method static Builder|Contact whereDebtorNumber($value)
 * @method static Builder|Contact whereDeletedAt($value)
 * @method static Builder|Contact whereDepartment($value)
 * @method static Builder|Contact whereDob($value)
 * @method static Builder|Contact whereFirstName($value)
 * @method static Builder|Contact whereHasDunningBlock($value)
 * @method static Builder|Contact whereHourly($value)
 * @method static Builder|Contact whereId($value)
 * @method static Builder|Contact whereIsArchived($value)
 * @method static Builder|Contact whereIsCreditor($value)
 * @method static Builder|Contact whereIsDebtor($value)
 * @method static Builder|Contact whereIsOrg($value)
 * @method static Builder|Contact whereName($value)
 * @method static Builder|Contact whereNote($value)
 * @method static Builder|Contact wherePaymentDeadlineId($value)
 * @method static Builder|Contact wherePosition($value)
 * @method static Builder|Contact whereRef($value)
 * @method static Builder|Contact whereRegisterCourt($value)
 * @method static Builder|Contact whereRegisterNumber($value)
 * @method static Builder|Contact whereSalutationId($value)
 * @method static Builder|Contact whereShortName($value)
 * @method static Builder|Contact whereTaxId($value)
 * @method static Builder|Contact whereTitleId($value)
 * @method static Builder|Contact whereUpdatedAt($value)
 * @method static Builder|Contact whereVatId($value)
 * @method static Builder|Contact whereWebsite($value)
 *                                                     *
 * @property-read Salutation|null $salutation
 * @property-read PaymentDeadline|null $payment_deadline
 * @property-read Tax|null $tax
 * @property string|null $tax_number
 * @property-read Collection<int, ContactAddress> $addresses
 * @property-read int|null $addresses_count
 * @property-read Collection<int, Contact> $contacts
 * @property-read int|null $contacts_count
 * @method static Builder|Contact whereTaxNumber($value)
 * @property-read Collection<int, ContactMail> $mails
 * @property-read int|null $mails_count
 * @property-read Collection<int, ContactPhone> $phones
 * @property-read int|null $phones_count
 * @property string|null $receipts_ref
 * @property string|null $iban
 * @method static Builder|Contact whereIban($value)
 * @method static Builder|Contact whereReceiptsRef($value)
 * @property int $outturn_account_id
 * @property bool $is_primary
 * @property string|null $paypal_email
 * @property string|null $cc_name
 * @method static Builder|Contact view($view)
 * @method static Builder|Contact whereCcName($value)
 * @method static Builder|Contact whereIsPrimary($value)
 * @method static Builder|Contact whereOutturnAccountId($value)
 * @method static Builder|Contact wherePaypalEmail($value)
 * @property-read Collection<int, Project> $projects
 * @property-read int|null $projects_count
 * @property-read string $company_name
 * @property-read bool $is_favorite
 * @property-read string $primary_mail
 * @method static Builder<static>|Contact whereHasMark(Mark $mark, \Illuminate\Database\Eloquent\Model $user, ?string $value = null)
 * @property-read string|null $formated_creditor_number
 * @property-read string|null $formated_debtor_number
 * @mixin Eloquent
 */
class Contact extends Model
{
    use Markable;

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
        'company_name',
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

    public function tax(): HasOne
    {
        return $this->hasOne(Tax::class, 'id', 'tax_id');
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class, 'owner_contact_id', 'id');
    }

    public function scopeView(Builder $query, $view): Builder
    {
        return match ($view) {
            'debtors' => $query->where('is_debtor', true),
            'orgs' => $query->where('is_org', true),
            'creditors' => $query->where('is_creditor', true),
            'archived' => $query->where('is_archived', true),
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
}
