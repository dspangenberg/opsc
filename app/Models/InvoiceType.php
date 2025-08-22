<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @method static Builder<static>|InvoiceType newModelQuery()
 * @method static Builder<static>|InvoiceType newQuery()
 * @method static Builder<static>|InvoiceType query()
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
