<?php

namespace App\Models;

use DateTimeInterface;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * 
 *
 * @property int $id
 * @property int $contact_id
 * @property string|null $address
 * @property string $zip
 * @property string $city
 * @property int $address_category_id
 * @property int $country_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder|ContactAddress newModelQuery()
 * @method static Builder|ContactAddress newQuery()
 * @method static Builder|ContactAddress query()
 * @method static Builder|ContactAddress whereAddress($value)
 * @method static Builder|ContactAddress whereAddressCategoryId($value)
 * @method static Builder|ContactAddress whereCity($value)
 * @method static Builder|ContactAddress whereContactId($value)
 * @method static Builder|ContactAddress whereCountryId($value)
 * @method static Builder|ContactAddress whereCreatedAt($value)
 * @method static Builder|ContactAddress whereId($value)
 * @method static Builder|ContactAddress whereUpdatedAt($value)
 * @method static Builder|ContactAddress whereZip($value)
 * @property-read AddressCategory|null $category
 * @property-read Contact|null $contact
 * @property-read Country|null $country
 * @property-read string $full_address
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
