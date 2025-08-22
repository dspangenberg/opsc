<?php

namespace App\Models;

use DateTimeInterface;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property-read \App\Models\AddressCategory|null $category
 * @property-read \App\Models\Contact|null $contact
 * @property-read \App\Models\Country|null $country
 * @property-read string $full_address
 * @method static Builder<static>|ContactAddress newModelQuery()
 * @method static Builder<static>|ContactAddress newQuery()
 * @method static Builder<static>|ContactAddress query()
 * @mixin Eloquent
 */
class ContactAddress extends Model
{
    protected $appends = [
        'full_address',
    ];

    protected $fillable = [
        'contact_id',
        'address',
        'zip',
        'city',
        'address_category_id',
        'country_id',
        'created_at',
        'updated_at',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $attributes = [
        'address' => '',
        'zip' => '',
        'city' => '',
        'country_id' => 1,
        'address_category_id' => 0,
    ];

    public function contact(): HasOne
    {
        return $this->hasOne(Contact::class, 'id', 'contact_id');
    }

    public function category(): HasOne
    {
        return $this->hasOne(AddressCategory::class, 'id', 'address_category_id');
    }

    public function country(): HasOne
    {
        return $this->hasOne(Country::class, 'id', 'country_id');
    }

    public function getFullAddressAttribute(): string
    {
        $lines = [];
        $lines[] = $this->contact->full_name;
        $lines[] = $this->address;

        if ($this->country_id === 1) {
            $lines[] = $this->zip.' '.$this->city;
        } else {
            $lines[] = strtoupper($this->zip.' '.$this->city);
            if ($this->country) {
                $lines[] = strtoupper($this->country->name);
            }
        }

        return implode("\n", $lines);
    }

    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->format('d.m.Y H:i');
    }

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
