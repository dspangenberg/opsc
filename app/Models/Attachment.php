<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Attachment extends Model
{
    protected $fillable = [
        'attachable_type',
        'attachable_id',
        'document_id',
        'pos',
    ];

    public $timestamps = false;

    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
