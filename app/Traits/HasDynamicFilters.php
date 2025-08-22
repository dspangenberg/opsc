<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

trait HasDynamicFilters {
    /**
     * Apply dynamic filters to query based on request
     */
    public function scopeApplyDynamicFilters(Builder $query, Request $request): Builder
    {
        $filterQuery = $this->parseDynamicFilters($request);

        if (empty($filterQuery)) {
            return $query;
        }

        foreach ($filterQuery as $filter) {
            $this->applyFilter($query, $filter);
        }

        return $query;
    }

    /**
     * Parse request filters into structured array
     */
    protected function parseDynamicFilters(Request $request): array
    {
        if (!$request->query('filter')) {
            return [];
        }

        $filterBool = $request->query('filter_bool', 'AND');
        if (!in_array($filterBool, ['AND', 'OR'])) {
            $filterBool = 'AND';
        }

        $filterQuery = [];
        $filters = $request->query('filter');

        foreach ($filters as $key => $value) {
            $values = explode(',', $value);

            if (count($values) > 1) {
                $operator = $values[0];
                array_splice($values, 0, 1);

                $queryValue = $this->prepareFilterValue($operator, $values);

                $filterQuery[] = [
                    'column' => $key,
                    'operator' => $operator,
                    'value' => $queryValue,
                    'boolean' => $filterBool,
                ];
            } else {
                $filterQuery[] = [
                    'column' => $key,
                    'operator' => '=',
                    'value' => $value,
                    'boolean' => $filterBool,
                ];
            }
        }

        return $filterQuery;
    }

    /**
     * Prepare filter value based on operator
     */
    protected function prepareFilterValue(string $operator, array $values): string|array
    {
        return match($operator) {
            'between' => [
                Carbon::parse($values[0])->startOfDay(),
                Carbon::parse($values[1])->endOfDay()
            ],
            'in', 'not_in' => $values,
            default => implode(',', $values)
        };
    }

    /**
     * Apply individual filter to query
     */
    protected function applyFilter(Builder $query, array $filter): void
    {
        $method = strtolower($filter['boolean']) === 'or' ? 'or' : '';

        switch ($filter['operator']) {
            case 'between':
                $query->{$method . 'WhereBetween'}($filter['column'], $filter['value']);
                break;
            case 'not_between':
                $query->{$method . 'WhereNotBetween'}($filter['column'], $filter['value']);
                break;
            case 'in':
                $query->{$method . 'WhereIn'}($filter['column'], $filter['value']);
                break;
            case 'not_in':
                $query->{$method . 'WhereNotIn'}($filter['column'], $filter['value']);
                break;
            case 'contains':
                $query->{$method . 'Where'}($filter['column'], 'LIKE', '%' . $filter['value'] . '%');
                break;
            case 'not_contains':
                $query->{$method . 'Where'}($filter['column'], 'NOT LIKE', '%' . $filter['value'] . '%');
                break;
            case 'starts_with':
                $query->{$method . 'Where'}($filter['column'], 'LIKE', $filter['value'] . '%');
                break;
            case 'ends_with':
                $query->{$method . 'Where'}($filter['column'], 'LIKE', '%' . $filter['value']);
                break;
            case 'null':
                $query->{$method . 'WhereNull'}($filter['column']);
                break;
            case 'not_null':
                $query->{$method . 'WhereNotNull'}($filter['column']);
                break;
            default:
                $query->{$method . 'Where'}($filter['column'], $filter['operator'], $filter['value']);
                break;
        }
    }
}
