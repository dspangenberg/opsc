<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $receipts_ref
 * @property string $name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @method static Builder|ReceiptCategory newModelQuery()
 * @method static Builder|ReceiptCategory newQuery()
 * @method static Builder|ReceiptCategory query()
 * @method static Builder|ReceiptCategory whereCreatedAt($value)
 * @method static Builder|ReceiptCategory whereId($value)
 * @method static Builder|ReceiptCategory whereName($value)
 * @method static Builder|ReceiptCategory whereReceiptsRef($value)
 * @method static Builder|ReceiptCategory whereUpdatedAt($value)
 *
 * @property string $type
 * @property int $is_private
 * @property int $outturn_account_id
 *
 * @method static Builder|ReceiptCategory whereIsPrivate($value)
 * @method static Builder|ReceiptCategory whereOutturnAccountId($value)
 * @method static Builder|ReceiptCategory whereType($value)
 *
 * @property int $is_confirmed
 *
 * @method static Builder|ReceiptCategory whereIsConfirmed($value)
 *
 * @mixin Eloquent
 */
class ReceiptCategory extends Model
{
    protected $fillable = [
        'name',
        'receipts_ref',
        'outturn_account_id',
        'is_confirmed',
    ];

    public static function getOrCreateCategoryFromReceipts(string $ref, string $name): int
    {

        $category = ReceiptCategory::firstOrNew(['receipts_ref' => $ref]);
        if (! $category->id) {
            $category->is_confirmed = false;
        }

        $category->name = $name;

        if (! $category->outturn_account_id) {
            $category->outturn_account_id = BookkeepingAccount::query()->where('type', 'e')->where('is_default', true)->first()->account_number;
        }

        $category->save();

        return $category->id;
    }

    public static function checkForOverwrite(string $ref)
    {
        $rule = BookkeepingRule::where('table', 'receipts_import')->where('is_active', 1) - with(['conditions' => function (Builder $query) use ($ref) {
            $query->where('receipts_ref', $ref);
        }])->with('actions')->first();

        if ($rule) {
            return $rule->action[0]->value;
        }

        return $ref;
    }
}
