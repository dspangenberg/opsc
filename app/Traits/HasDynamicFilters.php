<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

trait HasDynamicFilters
{
    /**
     * Define allowed filters for this model
     * Override this in your model to specify allowed filters
     *
     * ?filter[scope][]=scope,startsBetween,01.01.2024,31.01.2024&filter[scope][]=scope,view,billable&filter[project_id]=in,7,8,9
     * ?filter[scope][]=scope,view,billable&filter[scope][]=scope,maxDuration,01.12.2024&filter_bool=OR
     * ?filter[project_id][]=7&filter[project_id][]=8&filter[scope][]=scope,view,billable
     * ?filter[scope][]=scope,startsBetween,01.01.2024,31.01.2024&filter[scope][]=scope,view,billable&filter[project_id]=in,7,8,9&filter[user_id]=5&filter[note]=contains,wichtig&filter[is_locked]=0
     * ?filter[begin_at]=after,01.01.2024
     * ?filter[begin_at]=before,31.12.2024
     * ?filter[begin_at]=between,01.01.2024,31.01.2024
     */
    protected function getAllowedFilters(): array
    {
        return $this->allowedFilters ?? [];
    }

    /**
     * Define allowed operators
     */
    protected function getAllowedOperators(): array
    {
        return [
            '=', '!=', '<>', '<', '<=', '>', '>=',
            'like', 'not_like',
            'between', 'not_between',
            'after', 'before', // Date operators
            'in', 'not_in',
            'contains', 'not_contains',
            'starts_with', 'ends_with',
            'null', 'not_null',
            'scope', // Scope operator
        ];
    }

    /**
     * Define allowed scopes for this model
     * Override this in your model to specify allowed scopes
     */
    protected function getAllowedScopes(): array
    {
        return $this->allowedScopes ?? [];
    }

    /**
     * Apply dynamic filters to query based on request
     */
    public function scopeApplyDynamicFilters(Builder $query, Request $request, array $options = []): Builder
    {
        $filterQuery = $this->parseDynamicFilters($request, $options);

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
    protected function parseDynamicFilters(Request $request, array $options = []): array
    {
        if (! $request->query('filter')) {
            return [];
        }

        $allowedFilters = $options['allowed_filters'] ?? $this->getAllowedFilters();
        $allowedOperators = $options['allowed_operators'] ?? $this->getAllowedOperators();
        $allowedScopes = $options['allowed_scopes'] ?? $this->getAllowedScopes();

        $filterBool = $request->query('filter_bool', 'AND');
        if (! in_array($filterBool, ['AND', 'OR'])) {
            $filterBool = 'AND';
        }

        $filterQuery = [];
        $filters = $request->query('filter');

        foreach ($filters as $key => $value) {
            // Handle array of filters (für mehrere Scopes oder mehrere Werte)
            if (is_array($value)) {
                foreach ($value as $arrayValue) {
                    $processedFilters = $this->processFilter($key, $arrayValue, $filterBool, $allowedFilters, $allowedOperators, $allowedScopes);
                    $filterQuery = array_merge($filterQuery, $processedFilters);
                }
            } else {
                // Handle single filter
                $processedFilters = $this->processFilter($key, $value, $filterBool, $allowedFilters, $allowedOperators, $allowedScopes);
                $filterQuery = array_merge($filterQuery, $processedFilters);
            }
        }

        return $filterQuery;
    }

    /**
     * Process individual filter
     */
    protected function processFilter(string $key, string $value, string $filterBool, array $allowedFilters, array $allowedOperators, array $allowedScopes): array
    {
        $values = explode(',', $value);
        $filterQuery = [];

        if (count($values) > 1) {
            $operator = $values[0];

            // Skip if operator is not allowed
            if (! in_array($operator, $allowedOperators)) {
                return [];
            }

            // Special handling for scope operator
            if ($operator === 'scope') {
                $scopeName = $values[1];

                // Check if scope is allowed
                if (! empty($allowedScopes) && ! in_array($scopeName, $allowedScopes)) {
                    return [];
                }

                // Prepare scope parameters (if any)
                $scopeParams = array_slice($values, 2);

                $filterQuery[] = [
                    'column' => $key,
                    'operator' => 'scope',
                    'scope_name' => $scopeName,
                    'scope_params' => $scopeParams,
                    'value' => $values,
                    'boolean' => $filterBool,
                ];

                return $filterQuery;
            }

            // Skip if column is not in allowed filters (for non-scope operators)
            if (! empty($allowedFilters) && ! in_array($key, $allowedFilters)) {
                return [];
            }

            array_splice($values, 0, 1);
            $queryValue = $this->prepareFilterValue($operator, $values);

            $filterQuery[] = [
                'column' => $key,
                'operator' => $operator,
                'value' => $queryValue,
                'boolean' => $filterBool,
            ];
        } else {
            // Skip if column is not in allowed filters
            if (! empty($allowedFilters) && ! in_array($key, $allowedFilters)) {
                return [];
            }

            $filterQuery[] = [
                'column' => $key,
                'operator' => '=',
                'value' => $value,
                'boolean' => $filterBool,
            ];
        }

        return $filterQuery;
    }

    /**
     * Prepare filter value based on operator
     */
    protected function prepareFilterValue(string $operator, array $values): string|array
    {
        return match ($operator) {
            'between' => [
                Carbon::parse($values[0])->startOfDay(),
                Carbon::parse($values[1])->endOfDay(),
            ],
            'after' => Carbon::parse($values[0])->endOfDay(), // Nach dem Ende des angegebenen Tages
            'before' => Carbon::parse($values[0])->startOfDay(), // Vor dem Beginn des angegebenen Tages
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
            case 'scope':
                $scopeName = $filter['scope_name'];
                $scopeParams = $filter['scope_params'] ?? [];

                if ($method === 'or') {
                    $query->orWhere(function ($subQuery) use ($scopeName, $scopeParams) {
                        $subQuery->{$scopeName}(...$scopeParams);
                    });
                } else {
                    $query->{$scopeName}(...$scopeParams);
                }
                break;
            case 'between':
                $query->{$method.'WhereBetween'}($filter['column'], $filter['value']);
                break;
            case 'not_between':
                $query->{$method.'WhereNotBetween'}($filter['column'], $filter['value']);
                break;
            case 'after':
                $query->{$method.'Where'}($filter['column'], '>=', $filter['value']);
                break;
            case 'before':
                $query->{$method.'Where'}($filter['column'], '<=', $filter['value']);
                break;
            case 'in':
                $query->{$method.'WhereIn'}($filter['column'], $filter['value']);
                break;
            case 'not_in':
                $query->{$method.'WhereNotIn'}($filter['column'], $filter['value']);
                break;
            case 'contains':
                $query->{$method.'Where'}($filter['column'], 'LIKE', '%'.$filter['value'].'%');
                break;
            case 'not_contains':
                $query->{$method.'Where'}($filter['column'], 'NOT LIKE', '%'.$filter['value']);
                break;
            case 'starts_with':
                $query->{$method.'Where'}($filter['column'], 'LIKE', $filter['value'].'%');
                break;
            case 'ends_with':
                $query->{$method.'Where'}($filter['column'], 'LIKE', '%'.$filter['value']);
                break;
            case 'null':
                $query->{$method.'WhereNull'}($filter['column']);
                break;
            case 'not_null':
                $query->{$method.'WhereNotNull'}($filter['column']);
                break;
            default:
                $query->{$method.'Where'}($filter['column'], $filter['operator'], $filter['value']);
                break;
        }
    }
}
