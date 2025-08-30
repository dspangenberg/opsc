<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TaxRate> $rates
 * @property-read int|null $rates_count
 *
 * @method static Builder<static>|Tax newModelQuery()
 * @method static Builder<static>|Tax newQuery()
 * @method static Builder<static>|Tax query()
 *
 * @mixin Eloquent
 */
class Tax extends Model
{
    protected $fillable = [
        'name',
        'invoice_text',
        'value',
        'needs_vat_id',
        'is_default',
        'outturn_account_id',
    ];

    public function rates(): HasMany
    {
        return $this->hasMany(TaxRate::class);
    }

    protected function casts(): array
    {
        return [
            'value' => 'float',
        ];
    }
}
