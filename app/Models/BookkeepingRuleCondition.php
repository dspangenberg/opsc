<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $bookkeeping_rule_id
 * @property int $priority
 * @property string $table
 * @property string $field
 * @property string $logical_condition
 * @property string $value
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder|BookkeepingRuleCondition newModelQuery()
 * @method static Builder|BookkeepingRuleCondition newQuery()
 * @method static Builder|BookkeepingRuleCondition onlyTrashed()
 * @method static Builder|BookkeepingRuleCondition query()
 * @method static Builder|BookkeepingRuleCondition whereBookkeepingRuleId($value)
 * @method static Builder|BookkeepingRuleCondition whereCreatedAt($value)
 * @method static Builder|BookkeepingRuleCondition whereField($value)
 * @method static Builder|BookkeepingRuleCondition whereId($value)
 * @method static Builder|BookkeepingRuleCondition whereLogicalCondition($value)
 * @method static Builder|BookkeepingRuleCondition wherePriority($value)
 * @method static Builder|BookkeepingRuleCondition whereTable($value)
 * @method static Builder|BookkeepingRuleCondition whereUpdatedAt($value)
 * @method static Builder|BookkeepingRuleCondition whereValue($value)
 * @method static Builder|BookkeepingRuleCondition withTrashed()
 * @method static Builder|BookkeepingRuleCondition withoutTrashed()
 * @mixin Eloquent
 */
class BookkeepingRuleCondition extends Model
{
    protected $fillable = [
        'bookkeeping_rule_id',
        'field',
        'logical_condition',
        'value',
    ];
}
