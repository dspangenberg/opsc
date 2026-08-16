<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/profile');

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/profile', [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/app/profile/edit');

    $user->refresh();

    $this->assertSame('Test', $user->first_name);
    $this->assertSame('User', $user->last_name);
    $this->assertSame('test@example.com', $user->getPendingEmail());
    $this->assertNull($user->email_verified_at);
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/profile', [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/app/profile/edit');

    $this->assertNotNull($user->refresh()->email_verified_at);
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete('/profile', [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/');

    $this->assertGuest();
    $this->assertNull($user->fresh());
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from('/profile')
        ->delete('/profile', [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect('/profile');

    $this->assertNotNull($user->fresh());
});

test('replaces a user avatar on re-upload without a unique constraint violation', function () {
    config()->set('filesystems.disks.s3', [
        'driver' => 'local',
        'root' => storage_path('app/s3-test'),
        'visibility' => 'private',
    ]);
    Storage::forgetDisk('s3');

    $user = User::factory()->create();

    $uploadAvatar = function () use ($user) {
        return $this->actingAs($user)->patch('/profile', [
            'first_name' => 'Test',
            'last_name' => 'User',
            'email' => $user->email,
            'avatar' => UploadedFile::fake()->image('logo.png'),
        ]);
    };

    $uploadAvatar()->assertRedirect();

    $media = $user->fresh()->firstMedia('avatar');
    expect($media)->not->toBeNull();

    // Datei auf dem Disk entfernen, Media-Datensatz aber behalten: Genau diese
    // Situation ließ den Media-Upload gegen den Unique-Index laufen.
    Storage::disk('s3')->delete($media->getDiskPath());

    $uploadAvatar()->assertRedirect();

    expect($user->fresh()->firstMedia('avatar'))->not->toBeNull()
        ->and($user->fresh()->media()->count())->toBe(1);
});
