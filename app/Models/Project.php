<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Plank\Mediable\Exceptions\MediaUrlException;
use Plank\Mediable\Media;
use Plank\Mediable\Mediable;
use Plank\Mediable\MediableCollection;

/**
 * @property-read ProjectCategory|null $category
 * @property-read User|null $lead
 * @property-read Contact|null $manager
 * @property-read Contact|null $owner
 * @method static Builder<static>|Project newModelQuery()
 * @method static Builder<static>|Project newQuery()
 * @method static Builder<static>|Project query()
 * @property-read string|null $avatar_url
 * @property-read Collection<int, Media> $media
 * @property-read int|null $media_count
 * @method static MediableCollection<int, static> all($columns = ['*'])
 * @method static MediableCollection<int, static> get($columns = ['*'])
 * @method static Builder<static>|Project whereHasMedia($tags = [], bool $matchAll = false)
 * @method static Builder<static>|Project whereHasMediaMatchAll($tags)
 * @method static Builder<static>|Project withMedia($tags = [], bool $matchAll = false, bool $withVariants = false)
 * @method static Builder<static>|Project withMediaAndVariants($tags = [], bool $matchAll = false)
 * @method static Builder<static>|Project withMediaAndVariantsMatchAll($tags = [])
 * @method static Builder<static>|Project withMediaMatchAll(array|string  $tags = [], bool $withVariants = false)
 * @mixin Eloquent
 */
class Project extends Model
{
    use Mediable;

    protected $fillable = [
        'name',
        'owner_contact_id',
        'lead_user_id',
        'manager_contact_id',
        'invoice_contact_id',
        'project_category_id',
        'parent_project_id',
        'is_archived',
        'hourly',
        'budget_hours',
        'budget_costs',
        'budget_period',
        'begin_on',
        'end_on',
        'website',
        'note',
    ];

    protected $appends = [
        'avatar_url',
    ];

    protected $attributes = [
        'budget_hours' => 0,
        'budget_costs' => 0,
        'budget_period' => 0,
        'parent_project_id' => 0,
        'owner_contact_id' => 0,
        'project_category_id' => 0,
        'hourly' => 0,
        'lead_user_id' => 0,
        'manager_contact_id' => 0,
        'is_archived' => false,
        'name' => '',
        'website' => '',
        'note' => '',
    ];

    public function getAvatarUrlAttribute(): ?string
    {
        try {
            $media = $this->firstMedia('avatar');
            return $media?->getUrl();
        } catch (MediaUrlException $e) {
            return null;
        }
    }

    public function owner(): HasOne
    {
        return $this->hasOne(Contact::class, 'id', 'owner_contact_id');
    }

    public function manager(): HasOne
    {
        return $this->hasOne(Contact::class, 'id', 'manager_contact_id');
    }

    public function category(): HasOne
    {
        return $this->hasOne(ProjectCategory::class, 'id', 'project_category_id');
    }

    public function lead(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'lead_user_id');
    }
}
