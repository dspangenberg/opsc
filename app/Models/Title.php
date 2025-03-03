<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $correspondence_salutation_male
 * @property string $correspondence_salutation_female
 * @property string $correspondence_salutation_other
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @method static Builder|Title newModelQuery()
 * @method static Builder|Title newQuery()
 * @method static Builder|Title query()
 * @method static Builder|Title whereCorrespondenceSalutationFemale($value)
 * @method static Builder|Title whereCorrespondenceSalutationMale($value)
 * @method static Builder|Title whereCorrespondenceSalutationOther($value)
 * @method static Builder|Title whereCreatedAt($value)
 * @method static Builder|Title whereId($value)
 * @method static Builder|Title whereName($value)
 * @method static Builder|Title whereUpdatedAt($value)
 * @mixin IdeHelperTitle
 * @mixin Eloquent
 */
class Title extends Model
{
}
