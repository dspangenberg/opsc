<?php

namespace App\Services;

use App\Models\BookkeepingRule;
use Illuminate\Database\Eloquent\Model;

class BookkeepingRuleService
{
    public static function run(string $table, Model $model, ?array $ids)
    {

        $rules = BookkeepingRule::where('table', $table)
            ->has('conditions')
            ->has('actions')
            ->where('is_active', 1)
            ->orderBy('priority', 'DESC')
            ->with('conditions')
            ->with('actions')
            ->get();

        dump($rules);

        foreach ($rules as $rule) {
            self::runRule($rule, $model, $ids);
        }

    }

    protected static function runRule($rule, $model, ?array $ids): void
    {
        $mainQuery = [];
        foreach ($rule->conditions as $condition) {
            $mainQuery[] =
                [
                    'column' => $condition->field,
                    'operator' => $condition->logical_condition,
                    'value' => $condition->value,
                    'boolean' => $rule->logical_operator,
                    'is_locked' => 0,
                ];
        }
        dump($mainQuery);
        $records = $model::query()
            ->when($ids, function ($query, $ids) {
                return $query->whereIn('id', $ids);
            })
            ->where($mainQuery)->get();

        dump($records);
        $records->each(function ($record) use ($rule) {
            foreach ($rule->actions as $action) {
                $record[$action->field] = $action->value;
            }
            $record->save();
        });
    }
}
