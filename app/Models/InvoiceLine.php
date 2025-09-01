<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property-read Invoice|null $linked_invoice
 * @property-read TaxRate|null $rate
 *
 * @method static Builder<static>|InvoiceLine newModelQuery()
 * @method static Builder<static>|InvoiceLine newQuery()
 * @method static Builder<static>|InvoiceLine query()
 *
 * @mixin Eloquent
 */
class InvoiceLine extends Model
{
    protected $with = ['linked_invoice'];

    protected $fillable = [
        'invoice_id',
        'quantity',
        'unit',
        'text',
        'price',
        'amount',
        'tax',
        'type_id',
        'tax_id',
        'tax_rate_id',
        'service_period_begin',
        'service_period_end',
        'pos',
    ];

    protected $attributes = [
        'tax_id' => 0,
        'legacy_id' => 0,
        'tax_rate' => 0,
    ];

    public function linked_invoice(): HasOne
    {
        return $this->hasOne(Invoice::class, 'id', 'linked_invoice_id');
    }

    public function rate(): HasOne
    {
        return $this->hasOne(TaxRate::class, 'id', 'tax_rate_id');
    }

    protected function casts(): array
    {
        return [
            'service_period_begin' => 'date',
            'service_period_end' => 'date',
        ];
    }
}
