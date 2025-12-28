<?php

namespace App\Models;

use App\Traits\HasDynamicFilters;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Plank\Mediable\Mediable;

class Document extends Model
{
    use HasDynamicFilters, Mediable, SoftDeletes;

    protected $fillable = [
        'document_type_id',
        'contact_id',
        'project_id',
        'filename',
        'issued_on',
        'title',
        'label',
        'fulltext',
    ];

    protected function casts(): array
    {
        return [
            'file_created_at' => 'datetime',
            'issued_on' => 'date',
            'is_in_inbox' => 'boolean',
        ];
    }

    public function scopeView(Builder $query, $view): Builder
    {
        return match ($view) {
            'inbox' => $query->where('is_confirmed', false),
            'trash' => $query->onlyTrashed(),
            default => $query->where('is_confirmed', true)
        };
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'contact_id');
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(DocumentType::class, 'document_type_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class, 'project_id');
    }
}
