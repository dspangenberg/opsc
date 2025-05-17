<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property int $owner_contact_id
 * @property int $lead_user_id
 * @property int $manager_contact_id
 * @property int $invoice_contact_id
 * @property int $project_category_id
 * @property int $parent_project_id
 * @property int $is_archived
 * @property string $hourly
 * @property string $budget_hours
 * @property string $budget_costs
 * @property string $budget_period
 * @property string|null $begin_on
 * @property string|null $end_on
 * @property string $website
 * @property string $note
 * @property string|null $avatar
 * @property string|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read ProjectCategory|null $category
 * @property-read User|null $lead
 * @property-read Contact|null $owner
 *
 * @method static Builder|Project newModelQuery()
 * @method static Builder|Project newQuery()
 * @method static Builder|Project query()
 * @method static Builder|Project whereAvatar($value)
 * @method static Builder|Project whereBeginOn($value)
 * @method static Builder|Project whereBudgetCosts($value)
 * @method static Builder|Project whereBudgetHours($value)
 * @method static Builder|Project whereBudgetPeriod($value)
 * @method static Builder|Project whereCreatedAt($value)
 * @method static Builder|Project whereDeletedAt($value)
 * @method static Builder|Project whereEndOn($value)
 * @method static Builder|Project whereHourly($value)
 * @method static Builder|Project whereId($value)
 * @method static Builder|Project whereInvoiceContactId($value)
 * @method static Builder|Project whereIsArchived($value)
 * @method static Builder|Project whereLeadUserId($value)
 * @method static Builder|Project whereManagerContactId($value)
 * @method static Builder|Project whereName($value)
 * @method static Builder|Project whereNote($value)
 * @method static Builder|Project whereOwnerContactId($value)
 * @method static Builder|Project whereParentProjectId($value)
 * @method static Builder|Project whereProjectCategoryId($value)
 * @method static Builder|Project whereUpdatedAt($value)
 * @method static Builder|Project whereWebsite($value)
 *
 * @property-read \App\Models\Contact|null $manager
 *
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
