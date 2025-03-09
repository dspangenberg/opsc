<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * 
 *
 * @property int $id
 * @property int $contact_id
 * @property int $phone_category_id
 * @property int $pos
 * @property string $phone
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder|ContactPhone newModelQuery()
 * @method static Builder|ContactPhone newQuery()
 * @method static Builder|ContactPhone query()
 * @method static Builder|ContactPhone whereContactId($value)
 * @method static Builder|ContactPhone whereCreatedAt($value)
 * @method static Builder|ContactPhone whereId($value)
 * @method static Builder|ContactPhone wherePhone($value)
 * @method static Builder|ContactPhone wherePhoneCategoryId($value)
 * @method static Builder|ContactPhone wherePos($value)
 * @method static Builder|ContactPhone whereUpdatedAt($value)
 * @mixin Eloquent
 */
class ContactPhone extends Model
{
    protected $fillable = [
        'contact_id',
        'phone_category_id',
        'pos',
        'phone',
    ];
}
