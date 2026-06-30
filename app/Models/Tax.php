<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property-read Collection<int, TaxRate> $rates
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

        'account_input_tax',
        'account_vat',
        'tax_code_number',
        'default_rate_id',

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
