<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property string $search_field
 * @property string $search_value
 * @property string $set_field
 * @property string $set_value
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionRule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionRule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionRule query()
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionRule whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionRule whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionRule whereSearchField($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionRule whereSearchValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionRule whereSetField($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionRule whereSetValue($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionRule whereUpdatedAt($value)
 * @property string $table
 * @property string $comparator
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionRule whereComparator($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TransactionRule whereTable($value)
 * @mixin \Eloquent
 */
class TransactionRule extends Model
{
}
