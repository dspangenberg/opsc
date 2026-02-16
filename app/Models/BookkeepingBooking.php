<?php

namespace App\Models;

use App\Traits\HasDynamicFilters;
use Eloquent;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/**
 * @property-read BookkeepingAccount|null $account_credit
 * @property-read BookkeepingAccount|null $account_debit
 * @property-read Model|Eloquent $bookable
 * @property-read string $document_number
 * @property-read NumberRangeDocumentNumber|null $range_document_number
 * @property-read Tax|null $tax
 *
 * @method static Builder<static>|BookkeepingBooking newModelQuery()
 * @method static Builder<static>|BookkeepingBooking newQuery()
 * @method static Builder<static>|BookkeepingBooking query()
 * @method static Builder<static>|BookkeepingBooking search($search)
 *
 * @mixin Eloquent
 */
class BookkeepingBooking extends Model
{
    use HasDynamicFilters;

    protected $fillable = [
        'account_id_credit',
        'account_id_debit',
        'amount',
        'date',
        'tax_id',
        'is_split',
        'split_id',
        'booking_text',
        'document_number_prefix',
        'document_number_year',
        'document_number',
        'is_split',
        'split_id',
        'is_canceled',
        'note',
        'tax_credit',
        'tax_debit',
        'is_locked',
        'is_marked',
        'bookable_type',
        'bookable_id',
        'canceled_id'
    ];

    protected $appends = [
        'document_number',
        'document_number_range_prefix',
    ];

    /**
     * @param  Builder<static>  $query
     * @return Builder<static>
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        $search = trim($search ?? '');
        if ($search) {
            $query
                ->where('booking_text', 'like', "%$search%")
                ->orWhereRelation('range_document_number', 'document_number', '=', "$search");
        }

        return $query;
    }

    protected function getFilterLabel(string $key, mixed $value): ?string
    {
        return match ($key) {
            'issuedBetween' => is_array($value) && count($value) >= 2
                ? 'Zeitraum: '.Carbon::parse($value[0])->format('d.m.Y').' - '.Carbon::parse($value[1])->format('d.m.Y')
                : null,
            'account_id_credit' => ($account = BookkeepingAccount::where('account_number', $value)->first())
                ? 'Habenkonto: '.($account->label ?? $value)
                : 'Habenkonto: '.$value,
            'account_id_debit' => ($account = BookkeepingAccount::where('account_number', $value)->first())
                ? 'Sollkonto: '.($account->label ?? $value)
                : 'Sollkonto: '.$value,
            'is_locked' => 'nur unbestätigt',
            'hide_private' => 'private Buchungen ausblenden',
            'hide_transit' => 'Geldtransit ausblenden',
            default => null,
        };
    }

    public function scopeIssuedBetween(Builder $query, $from, $to): Builder
    {
        return $query->whereBetween('date', [$from, $to]);
    }

    /**
     * Konvertiert deutsche Datumsformate zu MySQL Format
     */
    protected static function convertDateFormat(string $date): string
    {
        if (preg_match('/^\d{2}\.\d{2}\.\d{4}$/', $date)) {
            return Carbon::createFromFormat('d.m.Y', $date)->format('Y-m-d');
        }

        return $date;
    }

    /**
     * Wendet Datumsfilter auf Query an
     */
    protected static function applyDateFilters(Builder $query, array $filters): Builder
    {
        if (isset($filters['date_from']) && isset($filters['date_to'])) {
            $dateFrom = self::convertDateFormat($filters['date_from']);
            $dateTo = self::convertDateFormat($filters['date_to']);
            $query->whereBetween('date', [$dateFrom, $dateTo]);
        }

        return $query;
    }

    /**
     * Erstellt Query für bestimmtes Konto
     */
    protected static function queryForAccount(string $accountNumber): Builder
    {
        return self::query()
            ->where(function ($q) use ($accountNumber) {
                $q->where('account_id_debit', $accountNumber)
                    ->orWhere('account_id_credit', $accountNumber);
            });
    }

    /**
     * Lädt Account-Labels für Buchungen
     */
    protected static function loadAccountLabels($bookings): Collection
    {
        $accountIds = $bookings->pluck('account_id_debit')
            ->merge($bookings->pluck('account_id_credit'))
            ->unique()
            ->filter()
            ->values();

        return BookkeepingAccount::whereIn('account_number', $accountIds)
            ->get()
            ->keyBy('account_number')
            ->map(fn ($account) => $account->label);
    }

    /**
     * Fügt Balance-Informationen zu Buchungen hinzu
     */
    protected static function addBalanceInfo(
        $bookings,
        int $accountNumberInt,
        $accountLabels,
        float $startBalance = 0
    ): float {
        $balance = $startBalance;

        foreach ($bookings as $booking) {
            $isDebit = $booking->account_id_debit == $accountNumberInt;
            $isCredit = $booking->account_id_credit == $accountNumberInt;

            if ($isDebit) {
                $balance += $booking->amount;
                $booking->balance_type = 'debit';
                $booking->counter_account = $booking->account_id_credit;
                $booking->counter_account_label = $accountLabels->get($booking->account_id_credit, '');
            }
            if ($isCredit) {
                $balance -= $booking->amount;
                $booking->balance_type = 'credit';
                $booking->counter_account = $booking->account_id_debit;
                $booking->counter_account_label = $accountLabels->get($booking->account_id_debit, '');
            }
            $booking->balance = $balance;
        }

        return $balance; // Rückgabe des finalen Saldos
    }

    /**
     * Calculate balance for a specific account
     *
     * @param  string  $accountNumber  Account number to calculate balance for
     * @param  array  $filters  Optional filters (e.g., date range)
     * @return float Balance (positive = debit exceeds credit, negative = credit exceeds debit)
     */
    public static function calculateBalanceForAccount(string $accountNumber, array $filters = []): float
    {
        $query = self::query();
        self::applyDateFilters($query, $filters);

        $debitSum = (clone $query)
            ->where('account_id_debit', $accountNumber)
            ->sum('amount');

        $creditSum = (clone $query)
            ->where('account_id_credit', $accountNumber)
            ->sum('amount');

        return $debitSum - $creditSum;
    }

    /**
     * Calculate balances for multiple accounts
     *
     * @param  array  $accountNumbers  Array of account numbers
     * @param  array  $filters  Optional filters (e.g., date range)
     * @return \Illuminate\Support\Collection Collection with account_number, label, and balance
     */
    public static function calculateBalancesForAccounts(array $accountNumbers, array $filters = []): Collection
    {
        $query = self::query();
        self::applyDateFilters($query, $filters);

        // Get aggregated debit sums grouped by account
        $debitSums = (clone $query)
            ->whereIn('account_id_debit', $accountNumbers)
            ->selectRaw('account_id_debit as account_number, SUM(amount) as total')
            ->groupBy('account_id_debit')
            ->pluck('total', 'account_number');

        // Get aggregated credit sums grouped by account
        $creditSums = (clone $query)
            ->whereIn('account_id_credit', $accountNumbers)
            ->selectRaw('account_id_credit as account_number, SUM(amount) as total')
            ->groupBy('account_id_credit')
            ->pluck('total', 'account_number');

        // Get all account numbers that have bookings (from either debit or credit)
        $accountsWithBookings = $debitSums->keys()
            ->merge($creditSums->keys())
            ->unique()
            ->values();

        // Only get accounts that have bookings
        $accounts = BookkeepingAccount::whereIn('account_number', $accountsWithBookings)
            ->orderBy('account_number')
            ->get();

        return $accounts->map(function ($account) use ($debitSums, $creditSums) {
            $debitSum = $debitSums->get($account->account_number, 0);
            $creditSum = $creditSums->get($account->account_number, 0);
            $balance = $debitSum - $creditSum;

            return [
                'account_number' => $account->account_number,
                'label' => $account->label,
                'debit_sum' => $debitSum,
                'credit_sum' => $creditSum,
                'balance' => $balance,
                'type' => $account->type,
            ];
        });
    }

    /**
     * Get running balance for bookings ordered by date
     * Returns collection with balance field added to each booking
     *
     * @param  string  $accountNumber  Account number to calculate running balance for
     * @param  array  $filters  Optional filters (e.g., date range)
     */
    public static function getRunningBalanceForAccount(string $accountNumber, array $filters = []): Collection
    {
        $query = self::queryForAccount($accountNumber);
        self::applyDateFilters($query, $filters);

        $bookings = $query
            ->with(['account_debit', 'account_credit', 'tax', 'range_document_number'])
            ->orderBy('date')
            ->orderBy('id')
            ->get();

        $accountNumberInt = (int) $accountNumber;
        $accountLabels = self::loadAccountLabels($bookings);
        self::addBalanceInfo($bookings, $accountNumberInt, $accountLabels);

        return $bookings;
    }

    /**
     * Get running balance for paginated bookings
     * Berechnet den korrekten Startsaldo für paginierte Ergebnisse
     *
     * @param  string  $accountNumber  Account number to calculate running balance for
     * @param  array  $filters  Optional filters (e.g., date range)
     * @param  int  $perPage  Items per page
     */
    public static function getRunningBalanceForAccountPaginated(
        string $accountNumber,
        array $filters = [],
        int $perPage = 15,
        string $sortDirection = 'desc'
    ): LengthAwarePaginator {
        $baseQuery = self::queryForAccount($accountNumber);
        self::applyDateFilters($baseQuery, $filters);

        // Für absteigende Sortierung: Paginiere absteigend
        $bookings = (clone $baseQuery)
            ->with(['account_debit', 'account_credit', 'tax', 'range_document_number'])
            ->orderBy('date', $sortDirection)
            ->orderBy('id', $sortDirection)
            ->paginate($perPage);

        $accountNumberInt = (int) $accountNumber;

        // Berechne Balance für jede Buchung
        // Bei DESC: Zeige Saldo nach jeder Buchung, beginnend mit dem aktuellen Gesamtsaldo
        if ($sortDirection === 'desc') {
            // Berechne den Saldo NACH der ersten (neuesten) Buchung auf dieser Seite
            // Das ist der Gesamtsaldo aller Buchungen bis einschließlich dieser Buchung
            $firstBookingOnPage = $bookings->first();
            if ($firstBookingOnPage) {
                $balanceAfterFirst = (clone $baseQuery)
                    ->where(function ($q) use ($firstBookingOnPage) {
                        $q->where('date', '<', $firstBookingOnPage->date)
                            ->orWhere(function ($q2) use ($firstBookingOnPage) {
                                $q2->where('date', '=', $firstBookingOnPage->date)
                                    ->where('id', '<=', $firstBookingOnPage->id);
                            });
                    })
                    ->selectRaw('SUM(CASE
                        WHEN account_id_debit = ? THEN amount
                        WHEN account_id_credit = ? THEN -amount
                        ELSE 0
                    END) as balance', [$accountNumberInt, $accountNumberInt])
                    ->value('balance') ?? 0;
            } else {
                $balanceAfterFirst = 0;
            }

            $accountLabels = self::loadAccountLabels($bookings);

            // Zeige Saldo NACH jeder Buchung, gehe rückwärts durch die Zeit
            $balance = $balanceAfterFirst;
            foreach ($bookings as $booking) {
                $isDebit = $booking->account_id_debit == $accountNumberInt;
                $isCredit = $booking->account_id_credit == $accountNumberInt;

                // Zeige den Saldo NACH dieser Buchung
                $booking->balance = $balance;

                if ($isDebit) {
                    $booking->balance_type = 'debit';
                    $booking->counter_account = $booking->account_id_credit;
                    $booking->counter_account_label = $accountLabels->get($booking->account_id_credit, '');
                    // Gehe rückwärts: ziehe den Betrag ab für die nächste (ältere) Buchung
                    $balance -= $booking->amount;
                }
                if ($isCredit) {
                    $booking->balance_type = 'credit';
                    $booking->counter_account = $booking->account_id_debit;
                    $booking->counter_account_label = $accountLabels->get($booking->account_id_debit, '');
                    // Gehe rückwärts: addiere den Betrag für die nächste (ältere) Buchung
                    $balance += $booking->amount;
                }
            }
        } else {
            // Aufsteigende Sortierung: wie vorher
            $startBalance = 0;
            if ($bookings->currentPage() > 1) {
                $previousBookings = (clone $baseQuery)
                    ->orderBy('date')
                    ->orderBy('id')
                    ->limit(($bookings->currentPage() - 1) * $perPage)
                    ->get();

                foreach ($previousBookings as $booking) {
                    if ($booking->account_id_debit == $accountNumberInt) {
                        $startBalance += $booking->amount;
                    }
                    if ($booking->account_id_credit == $accountNumberInt) {
                        $startBalance -= $booking->amount;
                    }
                }
            }

            $accountLabels = self::loadAccountLabels($bookings);
            self::addBalanceInfo($bookings, $accountNumberInt, $accountLabels, $startBalance);
        }

        return $bookings;
    }

    public static function createBooking(
        $parent,
        $dateField,
        $amountField,
        $debit_account,
        $credit_account,
        $documentNumberPrefix = '',
        $bookingId = null
    ): ?BookkeepingBooking {
        if (! $debit_account || ! $credit_account) {
            BookkeepingLog::create([
                'parent_model' => $parent::class,
                'parent_id' => $parent->id,
                'text' => ! $debit_account ? 'Sollkonto nicht gefunden' : 'Habenkonto nicht gefunden',
            ]);

            return null;
        }

        if ($bookingId) {
            $booking = BookkeepingBooking::find($bookingId);
            if ($booking->is_locked) {
                return null;
            }
        } else {
            $booking = new BookkeepingBooking;
            $booking->bookable()->associate($parent);
            $booking->date = $parent[$dateField];
        }

        if (!$booking->number_range_document_numbers_id  ||  $booking->number_range_document_numbers_id != $parent->number_range_document_numbers_id) {
            $booking->number_range_document_numbers_id = $parent->number_range_document_numbers_id;
        }

        $amount = $parent[$amountField];
        $booking->amount = $amount < 0 ? $amount * -1 : $amount;

        if ($parent->amount < 0) {
            $booking->account_id_credit = $debit_account->account_number;
            $booking->account_id_debit = $credit_account->account_number;
        } else {
            $booking->account_id_debit = $debit_account->account_number;
            $booking->account_id_credit = $credit_account->account_number;
        }


        if (get_class($parent) !== Transaction::class) {
            $taxes = BookkeepingAccount::getTax($booking->account_id_credit, $booking->account_id_debit, $booking->amount);
            $booking->tax_credit = $taxes['tax_credit'];
            $booking->tax_debit = $taxes['tax_debit'];
            $booking->tax_id = $taxes['tax_id'];
        } else {
            $booking->tax_credit = 0;
            $booking->tax_debit = 0;
            $booking->tax_id = 0;
        }

        $booking->booking_text = '';

        return $booking;
    }

    /**
     * @throws Exception
     */
    public static function correctBooking(int $bookingId): int
    {
        $booking = BookkeepingBooking::find($bookingId);
        if (! $booking) {
            throw new Exception('Booking not found');
        }

        if ($booking->is_locked) {
            return 0;
        }

        switch ($booking->bookable_type) {
            case 'App\Models\Receipt':
                $receipt = Receipt::find($booking->bookable_id);
                Receipt::createBooking($receipt);
                // Lade die aktualisierte Buchung neu
                $booking = BookkeepingBooking::whereMorphedTo('bookable', Receipt::class)
                    ->where('bookable_id', $receipt->id)
                    ->first();
                break;
            case 'App\Models\Invoice':
                $invoice = Invoice::find($booking->bookable_id);
                $booking = Invoice::createBooking($invoice);
                break;
            case 'App\Models\Transaction':
                $transaction = Transaction::find($booking->bookable_id);
                $booking = Transaction::createBooking($transaction);
                break;
        }

        return $booking?->id ?? $bookingId;
    }

    public function bookable(): MorphTo
    {
        return $this->morphTo();
    }

    public function account_credit(): HasOne
    {
        return $this->hasOne(BookkeepingAccount::class, 'account_number', 'account_id_credit');
    }

    public function account_debit(): HasOne
    {
        return $this->hasOne(BookkeepingAccount::class, 'account_number', 'account_id_debit');
    }

    public function tax(): HasOne
    {
        return $this->hasOne(Tax::class, 'id', 'tax_id');
    }

    public function getDocumentNumberAttribute(): string
    {
        if ($this->range_document_number) {
            return $this->range_document_number->document_number;
        }

        return $this->bookable ? $this->bookable->document_number : '';
    }

    public function getDocumentNumberRangePrefixAttribute(): string
    {
        if ($this->range_document_number) {
            return $this->range_document_number->range->prefix ?? '';
        }

        return '';
    }

    /**
     * Calculate the net amount based on tax rules.
     *
     * Bei §13b (Reverse Charge): beide Steuern gesetzt und gleich → Netto = Brutto
     * Bei §19a: keine Steuer → Netto = Brutto
     * Bei normaler USt: nur eine Steuer → Netto = Brutto - Steuer
     */
    public function getAmountNetAttribute(): float
    {
        $taxDebit = (float) ($this->tax_debit ?? 0);
        $taxCredit = (float) ($this->tax_credit ?? 0);

        // Wenn beide Steuern gesetzt sind (§13b) oder keine Steuer (§19a): Netto = Brutto
        $isReverseCharge = $taxDebit > 0 && $taxCredit > 0;
        $hasNoTax = $taxDebit == 0 && $taxCredit == 0;

        if ($isReverseCharge || $hasNoTax) {
            return round($this->amount, 2);
        }

        // Bei normaler USt: Brutto - Steuer
        return round($this->amount - ($taxDebit ?: $taxCredit), 2);
    }

    public function range_document_number(): HasOne
    {
        return $this->hasOne(NumberRangeDocumentNumber::class, 'id', 'number_range_document_numbers_id');
    }

    public function scopeHidePrivate(Builder $query): Builder
    {
        $privateAccounts = [1800, 1890];

        return $query->whereNotIn('account_id_debit', $privateAccounts)
            ->whereNotIn('account_id_credit', $privateAccounts);
    }

    public function scopeHideTransit(Builder $query): Builder
    {
        $transitAccounts = [1360];

        return $query->whereNotIn('account_id_debit', $transitAccounts)
            ->whereNotIn('account_id_credit', $transitAccounts);
    }

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_canceled' => 'boolean',
        ];
    }
}
