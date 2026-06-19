<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Blade;

/**
 * @property-read \App\Models\EmailAccount|null $emailAccount
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmailTemplate newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmailTemplate newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmailTemplate query()
 * @mixin \Eloquent
 */
class EmailTemplate extends Model
{
    protected $fillable = [
        'name',
        'subject',
        'body',
        'email_account_id',
    ];

    public function emailAccount(): BelongsTo
    {
        return $this->belongsTo(EmailAccount::class);
    }

    public static function render(string $name, array $data): ?array
    {
        $instance = self::query()->where('name', $name)->first();
        if ($instance === null) {
            return null;
        }

        return [
            'subject' => Blade::render($instance->subject, $data),
            'body' => Blade::render($instance->body, $data),
            'email_account_id' => $instance->email_account_id,
        ];
    }


}
