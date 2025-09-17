<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Plank\Mediable\Mediable;
use Plank\Mediable\MediableInterface;

/**
 * @property-read \App\Models\BookkeepingAccount|null $account
 * @property-read \App\Models\Contact|null $contact
 * @property-read \App\Models\CostCenter|null $costCenter
 * @property-read string $document_number
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Plank\Mediable\Media> $media
 * @property-read int|null $media_count
 * @property-read \App\Models\NumberRangeDocumentNumber|null $numberRangeDocumentNumber
 * @method static \Plank\Mediable\MediableCollection<int, static> all($columns = ['*'])
 * @method static \Plank\Mediable\MediableCollection<int, static> get($columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt whereHasMedia($tags = [], bool $matchAll = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt whereHasMediaMatchAll($tags)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt withMedia($tags = [], bool $matchAll = false, bool $withVariants = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt withMediaAndVariants($tags = [], bool $matchAll = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt withMediaAndVariantsMatchAll($tags = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Receipt withMediaMatchAll(bool $tags = [], bool $withVariants = false)
 * @mixin \Eloquent
 */
class Receipt extends Model
{
    use Mediable;

    protected $appends = [
        'document_number',
    ];

    protected $attributes = [
        'reference' => '',
        'contact_id' => null,
        'bookkeeping_account_id' => null,
        'cost_center_id' => null,
        'org_currency' => 'EUR',
        'org_amount' => 0,
        'amount' => 0,
        'is_confirmed' => false,
        'iban' => '',
        'number_range_document_number_id' => null,
        'checksum' => '',
        'text' => '',
        'data' => '[]',
    ];

    protected $fillable = [
        'reference',
        'contact_id',
        'bookkeeping_account_id',
        'cost_center_id',
        'org_currency',
        'org_amount',
        'amount',
        'is_confirmed',
        'iban',
        'checksum',
        'text',
        'data',
        'file_created_at',
        'duplicate_of'
    ];

    public function getDocumentNumberAttribute(): string
    {

        return $this->number_range_document_number_id ? $this->range_document_number->document_number : '';
    }


    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function costCenter(): BelongsTo
    {
        return $this->belongsTo(CostCenter::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(BookkeepingAccount::class);
    }

    public function range_document_number(): BelongsTo
    {
        return $this->belongsTo(NumberRangeDocumentNumber::class, 'number_range_document_number_id', 'id');
    }

    protected function casts(): array
    {
        return [
            'file_created_at' => 'datetime',
            'issued_on' => 'date',
            'is_confirmed' => 'boolean',
            'data' => 'array',
        ];
    }
}
