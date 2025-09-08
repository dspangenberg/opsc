<?php

use App\Models\Transaction;

uses(Tests\TestCase::class);

it('parses unwrapped filters and normalizes operator aliases', function () {
    $json = '{"counter_account_id":{"operator":"eq","value":"0"}}';

    $query = Transaction::query()->applyFiltersFromObject($json, [
        'allowed_filters' => ['counter_account_id'],
    ]);

    expect($query->toSql())->toContain('`counter_account_id` = ?');
    expect($query->getBindings())->toBe(['0']);
});

it('parses wrapped filters payload', function () {
    $json = '{"filters":{"counter_account_id":{"operator":"=","value":0}},"boolean":"AND"}';

    $query = Transaction::query()->applyFiltersFromObject($json, [
        'allowed_filters' => ['counter_account_id'],
    ]);

    expect($query->toSql())->toContain('`counter_account_id` = ?');
    expect($query->getBindings())->toBe([0]);
});
