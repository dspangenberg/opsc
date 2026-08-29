<?php

use App\Models\Tenant;
use App\Models\Todo;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Stancl\Tenancy\Facades\Tenancy;

beforeEach(function () {
    // Ein einziger Tenant wird erstellt und seine Datenbank nur beim ersten
    // Test dieser Datei vollständig migriert. Alle folgenden Tests verwenden
    // dieselbe Datenbank wieder, statt die komplette Tenant-Migration
    // erneut auszuführen.
    static $sharedTenant = null;
    static $sharedDomain = 'todo-test-tenant.test';
    static $migrated = false;

    if ($sharedTenant === null) {
        $sharedTenant = Tenant::factory()->create();
        $sharedTenant->domains()->create(['domain' => $sharedDomain]);
    }

    Tenancy::initialize($sharedTenant);

    if (! $migrated) {
        Artisan::call('tenants:migrate', ['--tenants' => [$sharedTenant->id], '--force' => true]);
        $migrated = true;
    }

    // Sauberen Zustand zwischen den Tests herstellen
    DB::table('todos')->delete();
    DB::table('users')->delete();

    $this->domain = $sharedDomain;
    $this->urlFor = fn (string $path): string => 'http://'.$sharedDomain.$path;

    $this->owner = User::factory()->create();
    $this->otherUser = User::factory()->create();
});

afterEach(function () {
    Tenancy::end();
});

it('allows an authorized user to complete a todo', function () {
    $todo = Todo::factory()->create([
        'created_by_user_id' => $this->owner->id,
        'assigned_to_user_id' => $this->owner->id,
        'completed_at' => null,
    ]);

    $response = $this
        ->actingAs($this->owner)
        ->withServerVariables(['HTTP_HOST' => $this->domain])
        ->put(($this->urlFor)('/app/todo/'.$todo->id.'/complete'));

    $response->assertStatus(302);

    expect($todo->fresh()->completed_at)->not->toBeNull();
});

it('allows a user assigned to a todo to complete it', function () {
    $todo = Todo::factory()->create([
        'created_by_user_id' => $this->otherUser->id,
        'assigned_to_user_id' => $this->owner->id,
        'completed_at' => null,
    ]);

    $response = $this
        ->actingAs($this->owner)
        ->withServerVariables(['HTTP_HOST' => $this->domain])
        ->put(($this->urlFor)('/app/todo/'.$todo->id.'/complete'));

    $response->assertStatus(302);

    expect($todo->fresh()->completed_at)->not->toBeNull();
});

it('allows an authorized user to uncomplete a todo', function () {
    $todo = Todo::factory()->create([
        'created_by_user_id' => $this->owner->id,
        'assigned_to_user_id' => $this->owner->id,
        'completed_at' => now(),
    ]);

    $response = $this
        ->actingAs($this->owner)
        ->withServerVariables(['HTTP_HOST' => $this->domain])
        ->put(($this->urlFor)('/app/todo/'.$todo->id.'/uncomplete'));

    $response->assertStatus(302);

    expect($todo->fresh()->completed_at)->toBeNull();
});

it('forbids an unauthorized user from completing another users todo', function () {
    $todo = Todo::factory()->create([
        'created_by_user_id' => $this->otherUser->id,
        'assigned_to_user_id' => $this->otherUser->id,
        'completed_at' => null,
    ]);

    $response = $this
        ->actingAs($this->owner)
        ->withServerVariables(['HTTP_HOST' => $this->domain])
        ->put(($this->urlFor)('/app/todo/'.$todo->id.'/complete'));

    $response->assertStatus(403);

    expect($todo->fresh()->completed_at)->toBeNull();
});

it('forbids an unauthorized user from uncompleting another users todo', function () {
    $todo = Todo::factory()->create([
        'created_by_user_id' => $this->otherUser->id,
        'assigned_to_user_id' => $this->otherUser->id,
        'completed_at' => now(),
    ]);

    $response = $this
        ->actingAs($this->owner)
        ->withServerVariables(['HTTP_HOST' => $this->domain])
        ->put(($this->urlFor)('/app/todo/'.$todo->id.'/uncomplete'));

    $response->assertStatus(403);

    expect($todo->fresh()->completed_at)->not->toBeNull();
});
