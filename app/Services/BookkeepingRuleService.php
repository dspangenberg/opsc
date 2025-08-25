<?php

namespace App\Services;

use App\Models\BookkeepingRule;
use Illuminate\Database\Eloquent\Model;

class BookkeepingRuleService
{
    public function run(string $table, Model $model, array $ids)
    {

        $rules = BookkeepingRule::where('table', $table)
            ->has('conditions')
            ->has('actions')
            ->where('is_active', 1)
            ->orderBy('priority', 'DESC')
            ->with('conditions')
            ->with('actions')
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
            });

        // Baue die WHERE-Bedingungen dynamisch auf
        foreach ($rule->conditions as $index => $condition) {
            if ($index === 0) {
                // Erste Bedingung immer mit where()
                $query->where($condition->field, $condition->logical_condition, $condition->value);
            } else {
                // Weitere Bedingungen je nach logical_operator
                if ($rule->logical_operator === 'and') {
                    $query->where($condition->field, $condition->logical_condition, $condition->value);
                } else {
                    $query->orWhere($condition->field, $condition->logical_condition, $condition->value);
                }
            }
        }

        $records = $query->get();
        // ds($records);

        $records->each(function ($record) use ($rule) {
            ds($record->id, $rule->name);
            foreach ($rule->actions as $action) {
                $record[$action->field] = $action->value;
            }
            $record->save();
        });
    }
}
