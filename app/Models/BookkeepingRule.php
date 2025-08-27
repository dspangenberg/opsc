<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property int $priority
 * @property string $logical_operator
 * @property string $table
 * @property int $is_active
 * @property string $action_type
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, BookkeepingRuleAction> $actions
 * @property-read int|null $actions_count
 * @property-read Collection<int, BookkeepingRuleCondition> $conditions
 * @property-read int|null $conditions_count
 * @method static Builder|BookkeepingRule newModelQuery()
 * @method static Builder|BookkeepingRule newQuery()
 * @method static Builder|BookkeepingRule onlyTrashed()
 * @method static Builder|BookkeepingRule query()
 * @method static Builder|BookkeepingRule whereActionType($value)
 * @method static Builder|BookkeepingRule whereCreatedAt($value)
 * @method static Builder|BookkeepingRule whereId($value)
 * @method static Builder|BookkeepingRule whereIsActive($value)
 * @method static Builder|BookkeepingRule whereLogicalOperator($value)
 * @method static Builder|BookkeepingRule whereName($value)
 * @method static Builder|BookkeepingRule wherePriority($value)
 * @method static Builder|BookkeepingRule whereTable($value)
 * @method static Builder|BookkeepingRule whereUpdatedAt($value)
 * @method static Builder|BookkeepingRule withTrashed()
 * @method static Builder|BookkeepingRule withoutTrashed()
 * @mixin Eloquent
 */
class BookkeepingRule extends Model
{
    protected $fillable = [
        'name',
        'priority',
        'logical_operator',
        'is_active',
    ];

    protected $attributes = [
        'name' => '',
        'priority' => 100,
        'logical_operator' => 'or',
        'is_active' => true,
        'action_type' => 'update',
    ];

    public function conditions(): HasMany
    {
        return $this->hasMany(BookkeepingRuleCondition::class, 'bookkeeping_rule_id', 'id');
    }

    public function actions(): HasMany
    {
        return $this->hasMany(BookkeepingRuleAction::class, 'bookkeeping_rule_id', 'id');
    }
}
