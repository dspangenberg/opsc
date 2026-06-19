<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmailAccount newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmailAccount newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmailAccount query()
 * @mixin \Eloquent
 */
class EmailAccount extends Model
{
    protected $fillable = [
        'name',
        'email',
        'smtp_username',
        'smtp_password',
        'signature',
    ];

    protected $hidden = [
        'smtp_password'
    ];
    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'smtp_password' => 'encrypted'
        ];
    }
}
