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
     * JSON Format:
     * {
     *   "filters": {
     *     "name": { "operator": "contains", "value": "John" },
     *     "created_at": { "operator": "between", "value": ["2024-01-01", "2024-12-31"] },
     *     "status": { "operator": "in", "value": ["active", "pending"] },
     *     "project_id": { "operator": "=", "value": 5 }
     *   },
     *   "boolean": "AND"
     * }
     *
     * // ?filters={"filters":{"hide_private":{"operator":"scope","hide_private":1}},"boolean":"AND"}
     *
     * URL Format (existing):
     * ?filter[scope][]=scope,startsBetween,01.01.2024,31.01.2024&filter[scope][]=scope,view,billable&filter[project_id]=in,7,8,9
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
     * Apply dynamic filters to query based on filter object or JSON string
     */
    public function scopeApplyFiltersFromObject(Builder $query, array|string $filters, array $options = []): Builder
    {
        if (empty($filters)) {
            return $query;
        }

        // Handle JSON string input
        if (is_string($filters)) {
            $filtersArray = json_decode($filters, true);
            if (json_last_error() !== JSON_ERROR_NONE) {
                // Invalid JSON, skip filtering
                return $query;
            }
            $filters = $filtersArray;
        }

        // Convert object filters to internal format using the unified parser
        $filterQuery = $this->parseFilters($filters, $options);

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

        // Try JSON format from query parameter
        if ($request->has('filters')) {
            $filtersInput = $request->input('filters');

            // If it's a JSON string (from query parameter)
            if (is_string($filtersInput)) {
                $filtersData = json_decode($filtersInput, true);

                if (json_last_error() === JSON_ERROR_NONE && is_array($filtersData)) {
                    return $this->parseFilters($filtersData, $options);
                }
            }

            // If it's already an array (from form data)
            if (is_array($filtersInput)) {
                return $this->parseFilters($filtersInput, $options);
            }
        }

        // Fall back to old URL parameter format
        if ($request->query('filter')) {
            return $this->parseUrlFilters($request, $options);
        }

        return [];
    }

    /**
     * Unified filter parser for both object/array and request data
     */
    protected function parseFilters(array $filtersData, array $options = []): array
    {

        // Accept both wrapped and unwrapped filter payloads
        if (! isset($filtersData['filters']) || ! is_array($filtersData['filters'])) {
            // If the payload itself looks like the inner "filters" map, wrap it
            $looksLikeFiltersMap = true;
            foreach ($filtersData as $k => $v) {
                if (! is_string($k) || ! is_array($v) || ! isset($v['operator'])) {
                    $looksLikeFiltersMap = false;
                    break;
                }
            }
            if ($looksLikeFiltersMap) {
                $filtersData = [
                    'filters' => $filtersData,
                    'boolean' => 'AND',
                ];
            } else {
                return [];
            }
        }

        $allowedFilters = $options['allowed_filters'] ?? $this->getAllowedFilters();
        $allowedOperators = $options['allowed_operators'] ?? $this->getAllowedOperators();
        $allowedScopes = $options['allowed_scopes'] ?? $this->getAllowedScopes();

        $filterBool = $this->validateBoolean($filtersData['boolean'] ?? 'AND');
        $filterQuery = [];

        foreach ($filtersData['filters'] as $column => $filterConfig) {
            if (! is_array($filterConfig)) {
                continue;
            }

            $operator = $filterConfig['operator'] ?? '=';
            // Normalize common operator aliases (e.g., eq -> =, ne -> !=)
            $operator = match (strtolower((string) $operator)) {
                'eq' => '=',
                'ne', 'neq' => '!=',
                'lt' => '<',
                'lte', 'le' => '<=',
                'gt' => '>',
                'gte', 'ge' => '>=',
                'nin' => 'not_in',
                default => $operator,
            };
            $value = $filterConfig['value'] ?? null;

            // Skip if operator is not allowed
            if (! in_array($operator, $allowedOperators)) {
                continue;
            }

            // Special handling for scope operator
            if ($operator === 'scope') {
                $filter = $this->buildScopeFilter($column, $filterConfig, $allowedScopes, $filterBool);
                if ($filter) {
                    $filterQuery[] = $filter;
                }

                continue;
            }

            // Skip if column is not in allowed filters (for non-scope operators)
            if (! empty($allowedFilters) && ! in_array($column, $allowedFilters)) {
                continue;
            }

            $queryValue = $this->prepareFilterValue($operator, $value);

            $filterQuery[] = [
                'column' => $column,
                'operator' => $operator,
                'value' => $queryValue,
                'boolean' => $filterBool,
            ];
        }

        return $filterQuery;
    }

    /**
     * Parse legacy URL filters (existing functionality)
     */
    protected function parseUrlFilters(Request $request, array $options = []): array
    {
        $allowedFilters = $options['allowed_filters'] ?? $this->getAllowedFilters();
        $allowedOperators = $options['allowed_operators'] ?? $this->getAllowedOperators();
        $allowedScopes = $options['allowed_scopes'] ?? $this->getAllowedScopes();

        $filterBool = $this->validateBoolean($request->query('filter_bool', 'AND'));
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
     * Validate and normalize boolean operator
     */
    protected function validateBoolean(string $boolean): string
    {
        return in_array(strtoupper($boolean), ['AND', 'OR']) ? strtoupper($boolean) : 'AND';
    }

    /**
     * Build scope filter configuration
     */
    protected function buildScopeFilter(string $column, array $filterConfig, array $allowedScopes, string $filterBool): ?array
    {
        // Use the column name as the scope name for JSON format
        $scopeName = $column;
        $scopeParams = [];

        // Check if 'value' exists and use it as scope parameter
        if (isset($filterConfig['value'])) {
            $scopeParams = is_array($filterConfig['value']) ? $filterConfig['value'] : [$filterConfig['value']];
        }

        // Also support 'params' key for explicit parameters
        if (isset($filterConfig['params'])) {
            $scopeParams = is_array($filterConfig['params']) ? $filterConfig['params'] : [$filterConfig['params']];
        }

        // Check if scope is allowed
        if (! empty($allowedScopes) && ! in_array($scopeName, $allowedScopes)) {
            return null;
        }

        return [
            'column' => $column,
            'operator' => 'scope',
            'scope_name' => $scopeName,
            'scope_params' => $scopeParams,
            'value' => $scopeName,
            'boolean' => $filterBool,
        ];
    }

    /**
     * Unified filter value preparation for both formats
     */
    protected function prepareFilterValue(string $operator, mixed $value): mixed
    {
        return match ($operator) {
            'between', 'not_between' => $this->prepareDateRange($value),
            'after' => $this->prepareDateValue($value, 'endOfDay'),
            'before' => $this->prepareDateValue($value, 'startOfDay'),
            'in', 'not_in' => is_array($value) ? $value : [$value],
            'null', 'not_null' => null,
            default => $value
        };
    }

    /**
     * Prepare date range values
     */
    protected function prepareDateRange(mixed $value): array
    {
        if (! is_array($value) || count($value) < 2) {
            return [];
        }

        return [
            Carbon::parse($value[0])->startOfDay(),
            Carbon::parse($value[1])->endOfDay(),
        ];
    }

    /**
     * Prepare single date value
     */
    protected function prepareDateValue(mixed $value, string $method): Carbon
    {
        return Carbon::parse($value)->{$method}();
    }

    /**
     * Process individual filter (legacy URL format)
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
            $queryValue = $this->prepareUrlFilterValue($operator, $values);

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
     * Prepare filter value based on operator for URL format
     */
    protected function prepareUrlFilterValue(string $operator, array $values): string|array
    {
        return match ($operator) {
            'between' => [
                Carbon::parse($values[0])->startOfDay(),
                Carbon::parse($values[1])->endOfDay(),
            ],
            'after' => Carbon::parse($values[0])->endOfDay(),
            'before' => Carbon::parse($values[0])->startOfDay(),
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
                $this->applyScopeFilter($query, $filter, $method);
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
                $query->{$method.'Where'}($filter['column'], 'NOT LIKE', '%'.$filter['value'].'%');
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

    /**
     * Apply scope filter to query
     */
    protected function applyScopeFilter(Builder $query, array $filter, string $method): void
    {
        $scopeName = $filter['scope_name'];
        $scopeParams = $filter['scope_params'] ?? [];

        // Convert snake_case to camelCase for scope methods
        $scopeMethodName = $this->convertScopeNameToCamelCase($scopeName);

        // Debug-Output

        if ($method === 'or') {
            $query->orWhere(function ($subQuery) use ($scopeMethodName, $scopeParams) {
                $subQuery->{$scopeMethodName}(...$scopeParams);
            });
        } else {
            $query->{$scopeMethodName}(...$scopeParams);
        }
    }

    /**
     * Convert snake_case scope name to camelCase method name
     */
    protected function convertScopeNameToCamelCase(string $scopeName): string
    {
        // Convert snake_case to camelCase (e.g., hide_private -> hidePrivate)
        return lcfirst(str_replace('_', '', ucwords($scopeName, '_')));
    }
}
