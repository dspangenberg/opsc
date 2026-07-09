<?php

use App\Models\BookkeepingRule;
use App\Models\BookkeepingRuleAction;
use App\Models\BookkeepingRuleCondition;
use App\Models\Transaction;
use App\Services\BookkeepingRuleService;

it('processes bookkeeping rules and applies actions correctly', function () {
    // Create test transaction
    $transaction = Transaction::factory()->create([
        'amount' => 100.00,
        'comment' => 'Test transaction',
    ]);

    // Create bookkeeping rule
    $rule = BookkeepingRule::create([
        'name' => 'Test Rule',
        'table' => 'transactions',
        'priority' => 100,
        'logical_operator' => 'and',
        'is_active' => 1,
        'action_type' => 'update',
    ]);

    // Create condition: amount = 100
    BookkeepingRuleCondition::create([
        'bookkeeping_rule_id' => $rule->id,
        'table' => 'transactions',
        'field' => 'amount',
        'logical_condition' => '=',
        'value' => '100',
        'priority' => 1,
    ]);

    // Create action: set contact_id = 5
    BookkeepingRuleAction::create([
        'bookkeeping_rule_id' => $rule->id,
        'table' => 'transactions',
        'field' => 'contact_id',
        'value' => '5',
        'priority' => 1,
    ]);

    // Run the service
    $service = new BookkeepingRuleService;
    $service->run('transactions', new Transaction, [$transaction->id]);

    // Verify the transaction was updated
    $transaction->refresh();
    expect($transaction->contact_id)->toBe(5);
});

it('handles multiple conditions with and operator', function () {
    // Create test transaction
    $transaction = Transaction::factory()->create([
        'amount' => 50.00,
        'comment' => 'Grocery store',
    ]);

    // Create bookkeeping rule
    $rule = BookkeepingRule::create([
        'name' => 'Grocery Rule',
        'table' => 'transactions',
        'priority' => 100,
        'logical_operator' => 'and',
        'is_active' => 1,
        'action_type' => 'update',
    ]);

    // Create conditions
    BookkeepingRuleCondition::create([
        'bookkeeping_rule_id' => $rule->id,
        'table' => 'transactions',
        'field' => 'amount',
        'logical_condition' => '=',
        'value' => '50',
        'priority' => 1,
    ]);

    BookkeepingRuleCondition::create([
        'bookkeeping_rule_id' => $rule->id,
        'table' => 'transactions',
        'field' => 'comment',
        'logical_condition' => 'like',
        'value' => '%Grocery%',
        'priority' => 2,
    ]);

    // Create action
    BookkeepingRuleAction::create([
        'bookkeeping_rule_id' => $rule->id,
        'table' => 'transactions',
        'field' => 'contact_id',
        'value' => '10',
        'priority' => 1,
    ]);

    // Run the service
    $service = new BookkeepingRuleService;
    $service->run('transactions', new Transaction, [$transaction->id]);

    // Verify the transaction was updated
    $transaction->refresh();
    expect($transaction->contact_id)->toBe(10);
});

it('processes multiple transactions efficiently', function () {
    // Create multiple test transactions
    $transactions = Transaction::factory()->count(5)->create([
        'amount' => 25.00,
    ]);

    // Create bookkeeping rule
    $rule = BookkeepingRule::create([
        'name' => 'Bulk Rule',
        'table' => 'transactions',
        'priority' => 100,
        'logical_operator' => 'and',
        'is_active' => 1,
        'action_type' => 'update',
    ]);

    // Create condition
    BookkeepingRuleCondition::create([
        'bookkeeping_rule_id' => $rule->id,
        'table' => 'transactions',
        'field' => 'amount',
        'logical_condition' => '=',
        'value' => '25',
        'priority' => 1,
    ]);

    // Create action
    BookkeepingRuleAction::create([
        'bookkeeping_rule_id' => $rule->id,
        'table' => 'transactions',
        'field' => 'contact_id',
        'value' => '15',
        'priority' => 1,
    ]);

    // Run the service
    $service = new BookkeepingRuleService;
    $service->run('transactions', new Transaction, $transactions->pluck('id')->toArray());

    // Verify all transactions were updated
    $transactions->each(function ($transaction) {
        $transaction->refresh();
        expect($transaction->contact_id)->toBe(15);
    });
});

it('ignores inactive rules', function () {
    // Create test transaction
    $transaction = Transaction::factory()->create([
        'amount' => 100.00,
    ]);

    // Create inactive bookkeeping rule
    $rule = BookkeepingRule::create([
        'name' => 'Inactive Rule',
        'table' => 'transactions',
        'priority' => 100,
        'logical_operator' => 'and',
        'is_active' => 0, // Inactive
        'action_type' => 'update',
    ]);

    // Create condition and action
    BookkeepingRuleCondition::create([
        'bookkeeping_rule_id' => $rule->id,
        'table' => 'transactions',
        'field' => 'amount',
        'logical_condition' => '=',
        'value' => '100',
        'priority' => 1,
    ]);

    BookkeepingRuleAction::create([
        'bookkeeping_rule_id' => $rule->id,
        'table' => 'transactions',
        'field' => 'contact_id',
        'value' => '20',
        'priority' => 1,
    ]);

    // Run the service
    $service = new BookkeepingRuleService;
    $service->run('transactions', new Transaction, [$transaction->id]);

    // Verify the transaction was NOT updated
    $transaction->refresh();
    // Factory default contact_id is 1, and inactive rule should not change it
    expect($transaction->contact_id)->toBe(1);
});
