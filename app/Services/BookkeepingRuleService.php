<?php

namespace App\Services;

use App\Models\BookkeepingRule;
use Illuminate\Database\Eloquent\Model;

class BookkeepingRuleService
{
    public function run(string $table, Model $model, array $ids)
    {
        // Optimize eager loading by combining with() calls
        $rules = BookkeepingRule::where('table', $table)
            ->has('conditions')
            ->has('actions')
            ->where('is_active', 1)
            ->orderBy('priority', 'DESC')
            ->with(['conditions', 'actions'])
            ->get();

        foreach ($rules as $rule) {
            self::runRule($rule, $model, $ids);
        }
    }

    protected static function runRule($rule, $model, $ids): void
    {
        $query = $model::query()
            ->when($ids, function ($query, $ids) {
                return $query->whereIn('id', $ids);
            })
            ->where(function ($query) use ($rule) {
                // Build WHERE conditions dynamically within a grouped closure
                foreach ($rule->conditions as $index => $condition) {
                    if ($index === 0) {
                        // First condition always uses where()
                        $query->where($condition->field, $condition->logical_condition, $condition->value);
                    } else {
                        // Additional conditions based on logical_operator
                        if ($rule->logical_operator === 'and') {
                            $query->where($condition->field, $condition->logical_condition, $condition->value);
                        } else {
                            $query->orWhere($condition->field, $condition->logical_condition, $condition->value);
                        }
                    }
                }
            });

        ds($ids);

        // Process records in chunks to handle large datasets efficiently
        // Using chunkById for reliable results when updating records during iteration
        $query->chunkById(100, function ($records) use ($ids, $rule) {
            $updates = [];
            $recordIds = [];

            foreach ($records as $record) {
                $recordIds[] = $record->id;

                if (!in_array($record->id, $ids)) {
                    ds('not in');
                }

                // Prepare bulk update data
                if (empty($updates)) {
                    foreach ($rule->actions as $action) {
                        $updates[$action->field] = $action->value;
                    }
                }
            }

            // Perform bulk update instead of individual saves
            if (! empty($updates) && ! empty($recordIds)) {
                $records->first()::whereIn('id', $recordIds)->update($updates);
            }
        });
    }
}
