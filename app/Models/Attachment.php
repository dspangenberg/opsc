<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Attachment extends Model
{
    protected $fillable = [
        'attachable_type',
        'attachable_id',
        'document_id',
        'pos',
    ];

    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    public function document(): HasOne
    {
        return $this->hasOne(Document::class, 'id', 'document_id');
    }

}
