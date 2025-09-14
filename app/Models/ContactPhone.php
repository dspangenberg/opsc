<?php

namespace App\Models;

use App\Data\PhoneCategoryData;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @method static Builder<static>|ContactPhone newModelQuery()
 * @method static Builder<static>|ContactPhone newQuery()
 * @method static Builder<static>|ContactPhone query()
 * @property-read \App\Models\PhoneCategory|null $category
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

    public function category(): HasOne
    {
        return $this->hasOne(PhoneCategory::class, 'id', 'phone_category_id');
    }
}
