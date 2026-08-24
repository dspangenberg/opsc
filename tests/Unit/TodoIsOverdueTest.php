<?php

use App\Models\Todo;

it('is overdue when due_at is in the past and not completed', function () {
    $todo = Todo::factory()->create(['due_at' => now()->subDay()]);

    expect($todo->is_overdue)->toBeTrue();
});

it('is not overdue when due_at is in the future', function () {
    $todo = Todo::factory()->create(['due_at' => now()->addDay()]);

    expect($todo->is_overdue)->toBeFalse();
});

it('is not overdue when due_at is null', function () {
    $todo = Todo::factory()->create(['due_at' => null]);

    expect($todo->is_overdue)->toBeFalse();
});

it('is not overdue when completed', function () {
    $todo = Todo::factory()->completed()->create(['due_at' => now()->subDay()]);

    expect($todo->is_overdue)->toBeFalse();
});
