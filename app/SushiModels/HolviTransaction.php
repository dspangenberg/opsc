<?php

namespace App\SushiModels;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Sushi\Sushi;

// https://github.com/laravel/ideas/issues/186#issuecomment-617882710

class HolviTransaction extends Model
{
    use Sushi;

    protected $table = 'money_money_transactions';

    protected static string $file = '';

    protected static int $bankAccountId = 0;

    public $incrementing = false;

    protected array $schema = [
        'Zahlungs-ID' => 'integer',
        'Buchungsdatum' => 'string',
        'ValutaDatum' => 'string',
        'text_key_extension' => 'integer',
        'bank_code' => 'string',
        'Währung' => 'string',
        'category' => 'string',
        'booking_key' => 'string',
        'purpose_code' => 'string',
        'return_reason' => 'string',
        'type' => 'string',
        'booking_text' => 'string',
        'transaction_code' => 'integer',
        'end_to_end_reference' => 'string',
        'mandate_reference' => 'string',
        'batch_reference' => 'string',
        'is_private' => 'boolean',
        'is_transit' => 'boolean',
        'primanota_number' => 'string',
        'bank_account_id' => 'integer',
        'Betrag' => 'float',
        'account_number' => 'string',
    ];

    public static function setFilename(string $file, $bankAccountId): void
    {
        self::$file = $file;
        self::$bankAccountId = $bankAccountId;
    }

    public function getRows(): array
    {
        if (empty(self::$file) || ! file_exists(self::$file)) {
            return [];
        }

        try {
            $fileContent = file_get_contents(self::$file);
            if ($fileContent === false) {
                return [];
            }

            $json = json_decode($fileContent, false, 512, JSON_THROW_ON_ERROR);

            if (! isset($json->transactions) || ! is_array($json->transactions)) {
                return [];
            }

            $records = collect($json->transactions)->map(function ($trans) {
                $trans = collect($trans)->mapWithKeys(fn ($value, $key) => [Str::snake($key) => $value]);

                if ($trans->get('id')) {
                    $trans['booked_on'] = Carbon::createFromTimestamp($trans->get('booking_date'))->format('Y-m-d') ?? null;
                    $trans['valued_on'] = Carbon::createFromTimestamp($trans->get('value_date'))->format('Y-m-d') ?? $trans['booked_on'];
                    $trans['mm_ref'] = $trans->get('id');
                    $trans['org_category'] = $trans->get('category');

                    if (! $trans->get('booking_text')) {
                        $trans['booking_text'] = '';
                    }
                    $trans['is_private'] = 0;
                    $trans['is_transit'] = 0;
                    $trans['bank_account_id'] = self::$bankAccountId;

                    return $trans->except(['id', 'booking_date', 'value_date', 'booked', 'checkmark']);
                }

                return null;
            });

            return array_filter(($records->toArray()));
        } catch (\Exception $e) {
            return [];
        }
    }

    protected function sushiShouldCache(): bool
    {
        return false;
    }
}
