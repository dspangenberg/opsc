<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property-read \App\Models\ProjectCategory|null $category
 * @property-read \App\Models\User|null $lead
 * @property-read \App\Models\Contact|null $manager
 * @property-read \App\Models\Contact|null $owner
 * @method static Builder<static>|Project newModelQuery()
 * @method static Builder<static>|Project newQuery()
 * @method static Builder<static>|Project query()
 * @mixin Eloquent
 */
class Project extends Model
{
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
        'avatar',
    ];

    protected $attributes = [
        'budget_hours' => 0,
        'budget_costs' => 0,
        'budget_period' => 0,
        'parent_project_id' => 0,
        'is_archived' => false,
        'website' => '',
        'note' => '',
    ];

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
