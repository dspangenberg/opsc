<?php
/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Models;

use App\Helpers\TenantHelper;
use Cviebrock\EloquentSluggable\Sluggable;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Stancl\Tenancy\Database\Concerns\MaintenanceMode;
use Stancl\Tenancy\Database\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Database\TenantCollection;
use Torann\Hashids\Facade\Hashids;

/**
 * 
 *
 * @property string $id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property array|null $data
 * @property string $last_name
 * @property string $first_name
 * @property string $company_house_name
 * @property string|null $address
 * @property string $zip
 * @property string $city
 * @property int|null $country_id
 * @property int|null $salutation_id
 * @property int|null $title_id
 * @property string|null $website
 * @property string|null $subdomain
 * @property string|null $email
 * @property int|null $otp
 * @property string|null $email_verified_at
 * @property string|null $setuped
 * @property int $is_suspended
 * @property string|null $note
 * @property-read Collection<int, Domain> $domains
 * @property-read int|null $domains_count
 * @property-read string $full_name
 * @property-read string $initials
 * @property-read string $reverse_full_name
 * @method static TenantCollection<int, static> all($columns = ['*'])
 * @method static Builder<static>|Tenant findSimilarSlugs(string $attribute, array $config, string $slug)
 * @method static TenantCollection<int, static> get($columns = ['*'])
 * @method static Builder<static>|Tenant newModelQuery()
 * @method static Builder<static>|Tenant newQuery()
 * @method static Builder<static>|Tenant query()
 * @method static Builder<static>|Tenant whereAddress($value)
 * @method static Builder<static>|Tenant whereCity($value)
 * @method static Builder<static>|Tenant whereCompanyHouseName($value)
 * @method static Builder<static>|Tenant whereCountryId($value)
 * @method static Builder<static>|Tenant whereCreatedAt($value)
 * @method static Builder<static>|Tenant whereData($value)
 * @method static Builder<static>|Tenant whereEmail($value)
 * @method static Builder<static>|Tenant whereEmailVerifiedAt($value)
 * @method static Builder<static>|Tenant whereFirstName($value)
 * @method static Builder<static>|Tenant whereId($value)
 * @method static Builder<static>|Tenant whereIsSuspended($value)
 * @method static Builder<static>|Tenant whereLastName($value)
 * @method static Builder<static>|Tenant whereNote($value)
 * @method static Builder<static>|Tenant whereOtp($value)
 * @method static Builder<static>|Tenant whereSalutationId($value)
 * @method static Builder<static>|Tenant whereSetuped($value)
 * @method static Builder<static>|Tenant whereSubdomain($value)
 * @method static Builder<static>|Tenant whereTitleId($value)
 * @method static Builder<static>|Tenant whereUpdatedAt($value)
 * @method static Builder<static>|Tenant whereWebsite($value)
 * @method static Builder<static>|Tenant whereZip($value)
 * @method static Builder<static>|Tenant withUniqueSlugConstraints(Model $model, string $attribute, array $config, string $slug)
 * @mixin IdeHelperTenant
 * @property string|null $prefix
 * @property-read string $formated_prefix
 * @method static Builder<static>|Tenant wherePrefix($value)
 * @property string $organisation
 * @method static Builder<static>|Tenant whereOrganisation($value)
 * @mixin Eloquent
 */
class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains, MaintenanceMode, Sluggable;

    protected $attributes = [
        'last_name' => '',
        'first_name' => '',
        'organisation' => '',
        'zip' => '',
        'city' => '',
        'otp' => 0,
        'prefix' => '',
        'website' => '',
        'email' => '',
        'subdomain' => '',
    ];
    protected $appends = [
        'full_name',
        'reverse_full_name',
        'initials',
        'formatedPrefix'
    ];

    public static function getCustomColumns(): array
    {
        return [
            'id',
            'last_name',
            'first_name',
            'organisation',
            'address',
            'zip',
            'city',
            'country_id',
            'salutation_id',
            'title_id',
            'website',
            'email',
            'subdomain',
            'prefix',
            'otp',
            'email_verified_at',
            'setuped',
            'created_at',
            'updated_at',
        ];
    }

    public static function getByHid(string $hid): Collection
    {
        $id = Hashids::decode($hid)[0];

        return Tenant::findOrFail($id);
    }

    public function sluggable(): array
    {
        return [
            'subdomain' => [
                'source' => 'company_house_name',
                'unique' => true,
            ],
        ];
    }

    public function getFormatedPrefixAttribute(): string
    {
        return implode('-', [
            strtoupper(substr($this->prefix, 0, 4)),
            strtoupper(substr($this->prefix, 4, 4)),
            strtoupper(substr($this->prefix, 8, 4))
        ]);
    }

    public function getFullNameAttribute(): string
    {
        if ($this->first_name) {
            return trim("$this->first_name $this->last_name");
        }

        return $this->last_name;
    }

    public function getInitialsAttribute(): string
    {
        if ($this->first_name) {
            return substr($this->first_name, 0, 1).substr($this->last_name, 0, 1);
        }

        return substr($this->last_name, 0, 1);
    }

    public function getReverseFullNameAttribute(): string
    {
        if ($this->first_name) {
            return "$this->last_name, $this->first_name";
        }

        return $this->last_name;
    }

    protected function casts(): array
    {
        return [
            'otp' => 'int',
        ];
    }
}
