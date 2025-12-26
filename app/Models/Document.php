<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Plank\Mediable\Mediable;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasDynamicFilters;
class Document extends Model
{
    use Mediable, SoftDeletes, HasDynamicFilters;

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
            'is_in_inbox' => 'boolean'
        ];
    }

    public function scopeView(Builder $query, $view): Builder
    {
        return match ($view) {
            'inbox' => $query->where('is_confirmed', false),
            'trash' => $query->onlyTrashed()
        };
    }

    public function contact(): HasOne
    {
        return $this->hasOne(Contact::class, 'id', 'contact_id');
    }

    public function type(): HasOne
    {
        return $this->hasOne(DocumentType::class, 'id', 'document_type_id');
    }

    public function project(): HasOne
    {
        return $this->hasOne(Project::class, 'id', 'project_id');
    }
}
