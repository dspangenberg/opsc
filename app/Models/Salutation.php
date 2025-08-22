<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $gender
 * @property int $is_hidden
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder<static>|Salutation newModelQuery()
 * @method static Builder<static>|Salutation newQuery()
 * @method static Builder<static>|Salutation query()
 * @method static Builder<static>|Salutation whereCreatedAt($value)
 * @method static Builder<static>|Salutation whereGender($value)
 * @method static Builder<static>|Salutation whereId($value)
 * @method static Builder<static>|Salutation whereIsHidden($value)
 * @method static Builder<static>|Salutation whereName($value)
 * @method static Builder<static>|Salutation whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Salutation extends Model
{
    protected $fillable = [
        'name',
        'gender',
        'is_hidden',
    ];
}
