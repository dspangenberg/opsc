<?php

namespace App\Services;

use App\Models\BookkeepingRule;
use Illuminate\Database\Eloquent\Model;

class BookkeepingRuleService
{
    public function run(string $table, Model $model, array $ids)
    {

        $lockfield = $table === 'receipts' ? 'is_confirmed' : 'is_locked';


        // Optimize eager loading by combining with() calls
        $rules = BookkeepingRule::where('table', $table)
            ->has('conditions')
            ->has('actions')
            ->where('is_active', 1)
            ->orderBy('priority')
            ->with(['conditions', 'actions'])
            ->get();

        foreach ($rules as $rule) {
            self::runRule($rule, $model, $ids, $lockfield);
        }
    }

    protected static function runRule($rule, $model, $ids, $lockfield): void
    {

        $query = $model::query()
            ->when($ids, function ($query, $ids) {
                return $query->whereIn('id', $ids);
            })
            ->when($rule->type === 'debit', function ($query) {
                return $query->where('amount', '<', 0);
            })
            ->when($rule->type === 'credit', function ($query) {
                return $query->where('amount', '>=', 0);
            })
            ->where($lockfield, false)
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

        // Process records in chunks to handle large datasets efficiently
        // Using chunkById for reliable results when updating records during iteration
        $query->chunkById(100, function ($records) use ($rule) {
            $updates = [];
            $recordIds = [];

            foreach ($records as $record) {
                $recordIds[] = $record->id;
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
