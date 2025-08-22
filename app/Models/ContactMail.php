<?php

namespace App\Models;

use DateTimeInterface;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property-read \App\Models\EmailCategory|null $category
 * @method static Builder<static>|ContactMail newModelQuery()
 * @method static Builder<static>|ContactMail newQuery()
 * @method static Builder<static>|ContactMail query()
 * @mixin Eloquent
 */
class ContactMail extends Model
{
    protected $fillable = [
        'contact_id',
        'email_category_id',
        'pos',
        'email',
        'created_at',
        'updated_at',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    protected $attributes = [
        'contact_id' => 0,
        'pos' => 0,
        'email_category_id' => 0,
        'email' => '',
    ];

    public function category(): HasOne
    {
        return $this->hasOne(EmailCategory::class, 'id', 'email_category_id');
    }

    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->format('d.m.Y H:i');
    }

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
