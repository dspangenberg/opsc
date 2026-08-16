<?php

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Facades\Tenancy;

beforeEach(function () {
    $this->tenant = Tenant::factory()->create();
    $this->domain = Domain::create([
        'tenant_id' => $this->tenant->id,
        'domain' => 'tenant-'.$this->tenant->id.'.test',
    ]);

    Tenancy::initialize($this->tenant);
    $this->artisan('tenants:migrate');

    $this->admin = User::factory()->create(['is_admin' => true]);
});

afterEach(function () {
    Tenancy::end();
});

it('replaces an admin user avatar on re-upload without a unique constraint violation', function () {
    config()->set('filesystems.disks.s3', [
        'driver' => 'local',
        'root' => storage_path('app/s3-test'),
        'visibility' => 'private',
    ]);
    Storage::forgetDisk('s3');

    $user = User::factory()->create();

    Tenancy::end();

    $uploadAvatar = function () use ($user) {
        return $this
            ->actingAs($this->admin)
            ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
            ->put('http://'.$this->domain->domain.'/admin/users/'.$user->id.'/edit', [
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'is_locked' => $user->is_locked,
                'avatar' => UploadedFile::fake()->image('logo.png'),
            ]);
    };

    $uploadAvatar()->assertRedirect();

    Tenancy::initialize($this->tenant);
    $media = $user->fresh()->firstMedia('avatar');
    expect($media)->not->toBeNull();

    // Datei auf dem Disk entfernen, Media-Datensatz aber behalten: Genau diese
    // Situation ließ den Media-Upload gegen den Unique-Index laufen.
    Storage::disk('s3')->delete($media->getDiskPath());
    Tenancy::end();

    $uploadAvatar()->assertRedirect();

    Tenancy::initialize($this->tenant);

    expect($user->fresh()->firstMedia('avatar'))->not->toBeNull()
        ->and($user->fresh()->media()->count())->toBe(1);
});

it('stores a new admin user avatar under the users directory', function () {
    config()->set('filesystems.disks.s3', [
        'driver' => 'local',
        'root' => storage_path('app/s3-test'),
        'visibility' => 'private',
    ]);
    Storage::forgetDisk('s3');
    Notification::fake();

    Tenancy::end();

    $this
        ->actingAs($this->admin)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/admin/users', [
            'first_name' => 'New',
            'last_name' => 'User',
            'email' => 'new-user@example.com',
            'is_admin' => false,
            'is_locked' => false,
            'avatar' => UploadedFile::fake()->image('logo.png'),
        ])
        ->assertRedirect();

    Tenancy::initialize($this->tenant);

    $user = User::where('email', 'new-user@example.com')->first();
    $media = $user->firstMedia('avatar');

    expect($media)->not->toBeNull()
        ->and($media->directory)->toBe('avatars/users')
        ->and($media->filename)->toBe('user-'.$user->id.'-avatar')
        ->and($media->extension)->toBe('png');
});
