<?php

use App\Models\Dropbox;
use App\Models\DropboxMail;
use App\Models\Tenant;
use App\Models\User;
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

    $this->user = User::factory()->create([
        'password' => bcrypt('password'),
    ]);

    $this->dropbox = Dropbox::create([
        'email_address' => 'info@'.$this->tenant->id.'.test',
        'name' => 'Test Dropbox',
        'is_shared' => false,
        'token' => Str::random(32),
        'user_id' => $this->user->id,
    ]);
});

afterEach(function () {
    Tenancy::end();
});

function inertiaHeaders(): array
{
    $version = null;

    if (config('app.asset_url')) {
        $version = hash('xxh128', config('app.asset_url'));
    } elseif (file_exists($manifest = public_path('build/manifest.json'))) {
        $version = hash_file('xxh128', $manifest);
    }

    return [
        'X-Inertia' => 'true',
        'X-Inertia-Version' => $version ?? '',
    ];
}

function createInboxMail(array $overrides = []): DropboxMail
{
    return DropboxMail::create(array_merge([
        'message_id' => uniqid('msg-'),
        'subject' => fake()->sentence(),
        'from' => 'sender@example.test',
        'to' => ['info@tenant.test'],
        'cc' => [],
        'body' => 'E-Mail Body',
        'dropbox_id' => test()->dropbox->id,
        'date' => now(),
        'is_inbound' => true,
        'is_visible_in_activity' => true,
    ], $overrides));
}

it('renders the inbox with scroll props for infinite scroll', function () {
    createInboxMail(['subject' => 'Erste E-Mail', 'date' => now()->subMinutes(2)]);
    createInboxMail(['subject' => 'Zweite E-Mail', 'date' => now()]);

    Tenancy::end();

    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/emails/'.$this->dropbox->id, inertiaHeaders());

    $response->assertStatus(200);
    $response->assertJsonPath('component', 'App/Email/EmailIndex');
    $response->assertJsonCount(2, 'props.mails.data');
    $response->assertJsonPath('props.mails.data.0.subject', 'Zweite E-Mail');
    $response->assertJsonPath('scrollProps.mails.pageName', 'page');
    $response->assertJsonPath('scrollProps.mails.previousPage', null);
    $response->assertJsonPath('scrollProps.mails.nextPage', null);
    $response->assertJsonPath('scrollProps.mails.currentPage', 1);
    $response->assertJsonPath('scrollProps.mails.reset', false);
});

it('exposes pagination metadata and next page on large inboxes', function () {
    foreach (range(1, 51) as $index) {
        createInboxMail(['subject' => 'E-Mail '.$index]);
    }

    Tenancy::end();

    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/emails/'.$this->dropbox->id, inertiaHeaders());

    $response->assertStatus(200);
    $response->assertJsonCount(50, 'props.mails.data');
    $response->assertJsonPath('props.mails.total', 51);
    $response->assertJsonPath('props.mails.to', 50);
    $response->assertJsonPath('scrollProps.mails.currentPage', 1);
    $response->assertJsonPath('scrollProps.mails.nextPage', 2);
});

it('marks a mail as seen when opening its details', function () {
    $mail = createInboxMail();

    Tenancy::end();

    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/emails/'.$this->dropbox->id.'/'.$mail->id, inertiaHeaders());

    $response->assertStatus(200);
    $response->assertJsonPath('props.mail.id', $mail->id);
    $this->assertNotNull($mail->fresh()->seen_at);
});

it('only resolves the mail prop when opening a mail via partial request', function () {
    $mail = createInboxMail(['subject' => 'E-Mail im Detail']);

    $this->assertNull($mail->seen_at);

    Tenancy::end();

    $headers = inertiaHeaders();
    $headers['X-Inertia-Partial-Component'] = 'App/Email/EmailIndex';
    $headers['X-Inertia-Partial-Data'] = 'mail';

    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.route('app.email.index', ['dropbox' => $this->dropbox->id, 'mail' => $mail->id], false), $headers);

    $response->assertSuccessful();
    $response->assertJsonPath('props.mail.id', $mail->id);
    $response->assertJsonMissingPath('props.mails');
    $response->assertJsonMissingPath('props.contacts');
    $response->assertJsonMissingPath('props.projects');
    $this->assertNotNull($mail->fresh()->seen_at);
});

it('merges the next page on an infinite scroll partial request', function () {
    foreach (range(1, 51) as $index) {
        createInboxMail(['subject' => 'E-Mail '.$index]);
    }

    Tenancy::end();

    $headers = inertiaHeaders();
    $headers['X-Inertia-Partial-Component'] = 'App/Email/EmailIndex';
    $headers['X-Inertia-Partial-Data'] = 'mails';

    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/emails/'.$this->dropbox->id.'?page=2', $headers);

    $response->assertStatus(200);
    $response->assertJsonCount(1, 'props.mails.data');
    $response->assertJsonPath('props.mails.total', 51);
    $response->assertJsonPath('scrollProps.mails.currentPage', 2);
    $response->assertJsonPath('scrollProps.mails.previousPage', 1);
    $response->assertJsonPath('scrollProps.mails.nextPage', null);
    $response->assertJsonPath('mergeProps', ['mails.data']);
});

it('forbids accessing another users private dropbox', function () {
    $otherUser = User::factory()->create();

    Tenancy::end();

    $this
        ->actingAs($otherUser)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/emails/'.$this->dropbox->id)
        ->assertStatus(403);
});
