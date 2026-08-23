<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static Builder<static>|InvoiceType newModelQuery()
 * @method static Builder<static>|InvoiceType newQuery()
 * @method static Builder<static>|InvoiceType query()
 *
 * @mixin Eloquent
 */
class InvoiceType extends Model
{
    use HasFactory;

    protected $fillable = [
        'print_name',
        'display_name',
        'abbreviation',
        'key',
        'zugferd_id',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'id' => 'integer',
        ];
    }
}
