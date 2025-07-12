<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
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
 * @property string $print_name
 * @property string $display_name
 * @property string $key
 * @method static Builder|InvoiceType whereDisplayName($value)
 * @method static Builder|InvoiceType whereKey($value)
 * @method static Builder|InvoiceType wherePrintName($value)
 * @mixin Eloquent
 */
class InvoiceType extends Model
{
    protected $fillable = [
        'print_name',
        'display_name',
        'abbreviation',
        'key',
    ];

    protected function casts(): array
    {
        return [
            'id' => 'integer',
        ];
    }
}
