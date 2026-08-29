<?php

use App\Enums\ZugferdProfileEnum;
use App\Models\Contact;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
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
    $this->artisan('tenants:migrate', ['--tenants' => [$this->tenant->id]]);

    $this->user = User::factory()->create();
});

afterEach(function () {
    Tenancy::end();
});

it('replaces a contact avatar on re-upload without a unique constraint violation', function () {
    config()->set('filesystems.disks.s3', [
        'driver' => 'local',
        'root' => storage_path('app/s3-test'),
        'visibility' => 'private',
    ]);
    Storage::forgetDisk('s3');

    $contact = Contact::factory()->create();

    Tenancy::end();

    $uploadAvatar = function () use ($contact) {
        return $this
            ->actingAs($this->user)
            ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
            ->put('http://'.$this->domain->domain.'/app/contacts/'.$contact->id.'/edit', [
                'is_org' => true,
                'name' => $contact->name,
                'has_dunning_block' => false,
                'zugferd_profile' => ZugferdProfileEnum::ZUGFERD->value,
                'avatar' => UploadedFile::fake()->image('logo.png'),
            ]);
    };

    $uploadAvatar()->assertRedirect();

    Tenancy::initialize($this->tenant);
    $media = $contact->fresh()->firstMedia('avatar');
    expect($media)->not->toBeNull();

    // Datei auf dem Disk entfernen, Media-Datensatz aber behalten: Genau diese
    // Situation ließ den Media-Upload gegen den Unique-Index laufen.
    Storage::disk('s3')->delete($media->getDiskPath());
    Tenancy::end();

    $uploadAvatar()->assertRedirect();

    Tenancy::initialize($this->tenant);

    expect($contact->fresh()->firstMedia('avatar'))->not->toBeNull()
        ->and($contact->fresh()->media()->count())->toBe(1);
});
