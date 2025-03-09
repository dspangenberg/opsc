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
 * @property string $name
 * @property string $invoice_text
 * @property string $value
 * @property int $needs_vat_id
 * @property int $is_default
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder|Tax newModelQuery()
 * @method static Builder|Tax newQuery()
 * @method static Builder|Tax query()
 * @method static Builder|Tax whereCreatedAt($value)
 * @method static Builder|Tax whereId($value)
 * @method static Builder|Tax whereInvoiceText($value)
 * @method static Builder|Tax whereIsDefault($value)
 * @method static Builder|Tax whereName($value)
 * @method static Builder|Tax whereNeedsVatId($value)
 * @method static Builder|Tax whereUpdatedAt($value)
 * @method static Builder|Tax whereValue($value)
 * @property int $account_input_tax
 * @property int $account_vat
 * @property int $tax_code_number
 * @method static Builder|Tax whereAccountInputTax($value)
 * @method static Builder|Tax whereAccountVat($value)
 * @method static Builder|Tax whereTaxCodeNumber($value)
 * @property int $is_bidirectional
 * @method static Builder|Tax whereIsBidirectional($value)
 * @property int $legacy_id
 * @method static Builder|Tax whereLegacyId($value)
 * @property int $is_used_in_invoicing
 * @method static Builder|Tax whereIsUsedInInvoicing($value)
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
    ];

    protected function casts(): array
    {
        return [
            'value' => 'float',
        ];
    }
}
