<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * 
 *
 * @property int $id
 * @property int $invoice_id
 * @property float|null $quantity
 * @property string|null $unit
 * @property string $text
 * @property float|null $price
 * @property float|null $amount
 * @property float|null $tax
 * @property int $tax_id
 * @property int $pos
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $type_id
 * @method static Builder|InvoiceLine newModelQuery()
 * @method static Builder|InvoiceLine newQuery()
 * @method static Builder|InvoiceLine query()
 * @method static Builder|InvoiceLine whereAmount($value)
 * @method static Builder|InvoiceLine whereCreatedAt($value)
 * @method static Builder|InvoiceLine whereId($value)
 * @method static Builder|InvoiceLine whereInvoiceId($value)
 * @method static Builder|InvoiceLine wherePos($value)
 * @method static Builder|InvoiceLine wherePrice($value)
 * @method static Builder|InvoiceLine whereQuantity($value)
 * @method static Builder|InvoiceLine whereTax($value)
 * @method static Builder|InvoiceLine whereTaxId($value)
 * @method static Builder|InvoiceLine whereText($value)
 * @method static Builder|InvoiceLine whereTypeId($value)
 * @method static Builder|InvoiceLine whereUnit($value)
 * @method static Builder|InvoiceLine whereUpdatedAt($value)
 * @property int $legacy_id
 * @method static Builder|InvoiceLine whereLegacyId($value)
 * @property-read Invoice|null $linked_invoice
 * @property-read \App\Models\TaxRate|null $rate
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
