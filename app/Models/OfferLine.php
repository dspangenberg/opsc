<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property-read Invoice|null $linked_invoice
 * @property-read TaxRate|null $rate
 * @method static Builder<static>|InvoiceLine newModelQuery()
 * @method static Builder<static>|InvoiceLine newQuery()
 * @method static Builder<static>|InvoiceLine query()
 * @mixin Eloquent
 */
class OfferLine extends Model
{
    protected $fillable = [
        'offer_id',
        'quantity',
        'unit',
        'text',
        'price',
        'amount',
        'tax',
        'tax_id',
        'tax_rate_id',
        'pos',
    ];

    protected $attributes = [
        'tax_id' => 0,
        'legacy_id' => 0,
        'tax_rate' => 0,
    ];

    public function rate(): HasOne
    {
        return $this->hasOne(TaxRate::class, 'id', 'tax_rate_id');
    }
}
