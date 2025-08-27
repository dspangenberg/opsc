<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $bookkeeping_rule_id
 * @property int $priority
 * @property string $field
 * @property string $value
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction query()
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction whereBookkeepingRuleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction whereField($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction wherePriority($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction whereValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction withoutTrashed()
 * @property string $table
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingRuleAction whereTable($value)
 * @mixin \Eloquent
 */
class BookkeepingRuleAction extends Model
{
    protected $fillable = [
        'bookkeeping_rule_id',
        'field',
        'value',
    ];
}
