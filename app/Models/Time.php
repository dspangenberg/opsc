<?php

namespace App\Models;

use DateTimeInterface;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Traits\HasDynamicFilters;

/**
 * @property-read TimeCategory|null $category
 * @property-read string $date
 * @property-read Project|null $project
 * @property-read User|null $user
 * @method static Builder<static>|Time byWeekOfYear(int $week, int $year)
 * @method static Builder<static>|Time endsBefore($date)
 * @method static Builder<static>|Time maxDuration($date)
 * @method static Builder<static>|Time newModelQuery()
 * @method static Builder<static>|Time newQuery()
 * @method static Builder<static>|Time query()
 * @method static Builder<static>|Time startsAfter($date)
 * @method static Builder<static>|Time startsBetween($from, $to)
 * @method static Builder<static>|Time view($view)
 * @method static Builder<static>|Time withMinutes()
 * @mixin Eloquent
 */
class Time extends Model
{
    use HasDynamicFilters;

    protected $fillable = [
        'project_id',
        'time_category_id',
        'subproject_id',
        'task_id',
        'user_id',
        'invoice_id',
        'note',
        'begin_at',
        'end_at',
        'is_locked',
        'is_billable',
        'is_timer',
        'minutes',
        'dob',
        'ping_at',
        'note',
        'avatar',
        'legacy_invoice_id',
        'legacy_id',
    ];

    protected $attributes = [
        'project_id' => 0,
        'time_category_id' => 0,
        'subproject_id' => 0,
        'legacy_invoice_id' => 0,
        'legacy_id' => 0,
        'user_id' => 0,
        'invoice_id' => 0,
        'begin_at' => '',
        'end_at' => '',
        'note' => '',
        'minutes' => 0,
        'is_timer' => false,
        'is_locked' => false,
        'is_billable' => false,
    ];

    protected $appends = [
        'date',
    ];

    public function getDateAttribute(): string
    {
        if ($this->begin_at) {
            return $this->begin_at->format('d.m.Y');
        }

        return '';
    }

    public function scopeMaxDuration(Builder $query, $date): Builder
    {
        if ($date) {
            $query->where('begin_at', '>=', $date);
        }

        return $query;
    }

    public function scopeView(Builder $query, $view): Builder
    {
        if ($view === 'billable') {
            return $query
                ->where('is_billable', true)
                ->where('is_locked', false)
                ->where('invoice_id', 0);
            // ->whereNotIn('project_id', [1, 7, 8, 9, 12, 13, 14, 15]); // ACHTUNG: Solange noch TN-Einträge ohne InvoiceId enthalten sind
        }

        return $query;
    }

    public function scopeByWeekOfYear(Builder $query, int $week, int $year): void
    {
        //       query.whereRaw('WEEK(begin_at, 1) = ?', [week]).whereRaw('YEAR(begin_at)=?', [year])
        $query
            ->whereRaw('WEEK(begin_at, 1) = ? AND YEAR(begin_at) = ?', [$week, $year]);
    }

    public function scopeWithMinutes(Builder $query): void
    {
        $query
            ->select(DB::raw('*, TIMESTAMPDIFF(MINUTE, begin_at, end_at) as mins, DATE(begin_at) as ts'));
    }

    public function category(): HasOne
    {
        return $this->hasOne(TimeCategory::class, 'id', 'time_category_id');
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function project(): HasOne
    {
        return $this->hasOne(Project::class, 'id', 'project_id');
    }

    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->format('d.m.Y H:i');
    }

    public function scopeStartsAfter(Builder $query, $date): Builder
    {
        dump(Carbon::parse($date));
        return $query->where('begin_at', '>=', Carbon::parse($date));
    }

    public function scopeStartsBetween(Builder $query, $from, $to): Builder
    {
        return $query->whereBetween('begin_at', [Carbon::parse($from), Carbon::parse($to)]);
    }

    public function scopeEndsBefore(Builder $query, $date): Builder
    {
        return $query->where('end_at', '=>=', Carbon::parse($date));
    }


    protected function casts(): array
    {
        return [
            'is_timer' => 'boolean',
            'is_locked' => 'boolean',
            'is_billable' => 'boolean',
            'begin_at' => 'datetime',
            'end_at' => 'datetime',
        ];
    }
}
