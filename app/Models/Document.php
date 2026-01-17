<?php

namespace App\Models;

use App\Traits\HasDynamicFilters;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Plank\Mediable\Media;
use Plank\Mediable\Mediable;
use Plank\Mediable\MediableCollection;

/**
 * @property-read Collection<int, Attachment> $attachments
 * @property-read int|null $attachments_count
 * @property-read Contact|null $contact
 * @property-read Collection<int, Media> $media
 * @property-read int|null $media_count
 * @property-read Project|null $project
 * @property-read DocumentType|null $type
 * @method static MediableCollection<int, static> all($columns = ['*'])
 * @method static Builder<static>|Document applyDynamicFilters(Request $request, array $options = [])
 * @method static Builder<static>|Document applyFiltersFromObject(array|string $filters, array $options = [])
 * @method static MediableCollection<int, static> get($columns = ['*'])
 * @method static Builder<static>|Document newModelQuery()
 * @method static Builder<static>|Document newQuery()
 * @method static Builder<static>|Document onlyTrashed()
 * @method static Builder<static>|Document query()
 * @method static Builder<static>|Document view($view)
 * @method static Builder<static>|Document whereHasMedia($tags = [], bool $matchAll = false)
 * @method static Builder<static>|Document whereHasMediaMatchAll($tags)
 * @method static Builder<static>|Document withMedia($tags = [], bool $matchAll = false, bool $withVariants = false)
 * @method static Builder<static>|Document withMediaAndVariants($tags = [], bool $matchAll = false)
 * @method static Builder<static>|Document withMediaAndVariantsMatchAll($tags = [])
 * @method static Builder<static>|Document withMediaMatchAll(array|string  $tags = [], bool $withVariants = false)
 * @method static Builder<static>|Document withTrashed(bool $withTrashed = true)
 * @method static Builder<static>|Document withoutTrashed()
 * @mixin Eloquent
 */
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

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'document_id', 'id');
    }
}
