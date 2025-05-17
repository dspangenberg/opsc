<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
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
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $type_id
 *
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine query()
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine whereInvoiceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine wherePos($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine wherePrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine whereTax($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine whereTaxId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine whereText($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine whereTypeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine whereUnit($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine whereUpdatedAt($value)
 *
 * @property int $legacy_id
 *
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceLine whereLegacyId($value)
 *
 * @property string $print_name
 * @property string $display_name
 * @property string $key
 *
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceType whereDisplayName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceType whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|InvoiceType wherePrintName($value)
 *
 * @mixin \Eloquent
 */
class InvoiceType extends Model
{
    protected $fillable = [
        'print_name',
        'display_name',
        'key',
    ];

    protected function casts(): array
    {
        return [
            'id' => 'integer',
        ];
    }
}
