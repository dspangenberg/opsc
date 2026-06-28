<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property int $type
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @method static Builder|PhoneCategory newModelQuery()
 * @method static Builder|PhoneCategory newQuery()
 * @method static Builder|PhoneCategory query()
 * @method static Builder|PhoneCategory whereCreatedAt($value)
 * @method static Builder|PhoneCategory whereId($value)
 * @method static Builder|PhoneCategory whereName($value)
 * @method static Builder|PhoneCategory whereType($value)
 * @method static Builder|PhoneCategory whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
class PhoneCategory extends Model
{
    protected $fillable = [
        'name',
        'type',
    ];
}
