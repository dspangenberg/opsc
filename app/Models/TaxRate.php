<?php
/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TaxRate extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'tax_id',
        'rate',
    ];

    public function tax(): BelongsTo
    {
        return $this->belongsTo(Tax::class);
    }
}
