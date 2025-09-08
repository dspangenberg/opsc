<?php

use App\Models\Transaction;

uses(Tests\TestCase::class);

it('parses null operator for whereNull', function () {
    $json = '{"filters":{"counter_account_id":{"operator":"null","value":null}},"boolean":"AND"}';

    $query = Transaction::query()->applyFiltersFromObject($json, [
        'allowed_filters' => ['counter_account_id'],
    ]);

    expect($query->toSql())->toContain('`counter_account_id` is null');
    expect($query->getBindings())->toBe([]);
});
