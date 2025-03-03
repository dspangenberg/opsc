<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $gender
 * @property int $is_hidden
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation query()
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation whereGender($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation whereIsHidden($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Salutation whereUpdatedAt($value)
 * @mixin IdeHelperSalutation
 * @mixin \Eloquent
 */
class Salutation extends Model
{
}
