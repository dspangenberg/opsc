<?php

namespace App\Models;

use App\Ai\Agents\DocumentExtractor;
use App\Traits\HasDynamicFilters;
use Eloquent;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Log;
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
 *
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
 *
 * @mixin Eloquent
 */
class Document extends Model
{
    use HasDynamicFilters, HasFactory, Mediable, SoftDeletes;

    protected $fillable = [
        'document_type_id',
        'sender_contact_id',
        'receiver_contact_id',
        'project_id',
        'filename',
        'issued_on',
        'received_on',
        'title',
        'label',
        'fulltext',
        'summary',
        'source_file',
        'is_hidden',
        'is_inbound',
    ];

    protected function casts(): array
    {
        return [
            'file_created_at' => 'datetime',
            'issued_on' => 'date',
            'received_on' => 'date',
            'sent_on' => 'date',
        ];
    }

    protected $appends = [
        'folder',
    ];

    public function getFolderAttribute(): string
    {
        return $this->issued_on?->translatedFormat('F Y') ?? '';
    }

    public function scopeContact(Builder $query, ?int $contactId): Builder
    {

        if ($contactId !== null) {
            $query->where(function ($q) use ($contactId) {
                $q->where('sender_contact_id', $contactId)->orWhere('receiver_contact_id', $contactId);
            });
        }

        return $query;
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {

        if ($search !== null) {
            $search = '%'.$search.'%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', $search)->orWhere('summary', 'like', $search);
            });
        }

        return $query;
    }

    public function scopeView(Builder $query, $view): Builder
    {
        return match ($view) {
            'inbox' => $query->where('is_confirmed', false),
            'trash' => $query->onlyTrashed(),
            default => $query->where('is_confirmed', true)
        };
    }

    public function extractFromFullText(): self
    {
        // Eingabeverifizierung - fulltext darf nicht null oder leer sein
        if ($this->fulltext === null || trim($this->fulltext) === '') {
            Log::warning('Dokumentextraktion abgebrochen - fulltext ist leer oder null', [
                'document_id' => $this->id,
                'filename' => $this->filename ?? 'unbekannt',
            ]);

            return $this;
        }

        try {
            $agent = DocumentExtractor::make();
            $result = $agent->prompt($this->fulltext);

            // Überprüfen, ob das Ergebnis ein Array ist
            if (! is_array($result)) {
                Log::error('Ungültiges Ergebnis von DocumentExtractor - kein Array zurückgegeben', [
                    'document_id' => $this->id,
                    'result_type' => gettype($result),
                ]);

                return $this;
            }

            // Sichere Zugriff auf Array-Elemente mit isset() und Null-Coalescing
            if (isset($result['issued_on']) && $result['issued_on'] !== null) {
                $this->issued_on = $result['issued_on'];
            }

            if (isset($result['title']) && $result['title'] !== null) {
                $this->title = $result['title'];
            }

            if (isset($result['summary']) && $result['summary'] !== null) {
                $this->summary = $result['summary'];
            }

        } catch (Exception $e) {
            Log::error('Fehler bei der Dokumentextraktion', [
                'document_id' => $this->id,
                'filename' => $this->filename ?? 'unbekannt',
                'error' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
            ]);
        }

        // Speichern und Rückgabe beibehalten
        $this->save();

        return $this;
    }

    public function sender_contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'sender_contact_id');
    }

    public function receiver_contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class, 'receiver_contact_id');
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
