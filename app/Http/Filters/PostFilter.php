<?php

namespace App\Http\Filters;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Kettasoft\Filterable\Filterable;
use Kettasoft\Filterable\Support\Payload;

class PostFilter extends Filterable
{
    /**
     * Registered filters to operate upon.
     *
     * @var array
     */
    protected $filters = ['title','issuedOn','tag'];

        /**
    * Filter the query by a given title.
    *
    * @param Payload $payload
    * @return Builder
    */
    public function title(Payload $payload)
    {
        if ($payload->value) {
            return $this->builder->where('title', $payload->operator, $payload);
        }

        return $this->builder;
    }

    /**
    * Filter the query by a given issuedOn.
    *
    * @param Payload $payload
    * @return Builder
    */
    public function issuedOn(Payload $payload)
    {
        if ($payload->value) {
            return $this->builder->where('issuedOn', $payload->operator, $payload);
        }

        return $this->builder;
    }

    /**
    * Filter the query by a given tag.
    *
    * @param Payload $payload
    * @return Builder
    */
    public function tag(Payload $payload)
    {
        if ($payload->value) {
            return $this->builder->where('tag', $payload->operator, $payload);
        }

        return $this->builder;
    }

    /**
     * Initial processing of the query builder before applying filters.
     *
     * @param Builder $builder
     * @return Builder
     */
    protected function initially(Builder $builder): Builder
    {
        return $builder;
    }

    /**
     * Finalize the query builder after all filters have been applied.
     *
     * @param Builder $builder
     * @return Builder
     */
    protected function finally(Builder $builder): Builder
    {
        return $builder;
    }
}
