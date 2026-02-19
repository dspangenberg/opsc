<?php

use App\Data\ProjectData;
use App\Models\Project;
use App\Models\ProjectCategory;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Facades\Tenancy;

beforeEach(function () {
    // Erstelle einen Standard-Tenant und einen Benutzer für Tests
    $this->tenant = Tenant::factory()->create();
    $this->domain = Domain::create([
        'tenant_id' => $this->tenant->id,
        'domain' => 'tenant-' . $this->tenant->id . '.test'
    ]);

    // Überprüfe, ob die Domain korrekt erstellt wurde
    $this->assertNotNull($this->domain);
    $this->assertEquals($this->tenant->id, $this->domain->tenant_id);

    // Wechsle zum Tenant
    Tenancy::initialize($this->tenant);

    // Führe die Tenant-Migrationen aus
    $this->artisan('tenants:migrate');

    // Erstelle einen Kontakt für den Tenant (für owner_contact_id)
    $this->contact = \App\Models\Contact::factory()->create();

    // Erstelle einen Benutzer für den Tenant
    $this->user = User::factory()->create([
        'password' => bcrypt('password'),
    ]);

    // Stelle sicher, dass die Tenant-Initialisierung korrekt durchgeführt wurde
    $this->assertTrue(tenancy()->initialized);
    $this->assertEquals($this->tenant->id, tenancy()->tenant->id);
});

it('can list projects for tenant', function () {
    // Erstelle Projekte für den Tenant
    $projects = Project::factory()->count(3)->create(['is_archived' => false]);

    // Beende die Tenancy, damit der HTTP-Request sie neu initialisieren kann
    Tenancy::end();

    // Führe den Test aus mit der Tenant-Domain im Host-Header
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://' . $this->domain->domain . '/app/projects');

    // Überprüfe die Antwort
    $response->assertStatus(200);
    $response->assertInertia(
        fn ($page) => $page
            ->component('App/Project/ProjectIndex')
            ->has('projects.data', 3)
    );
});

it('can create a project', function () {
    // Erstelle eine Kategorie für den Tenant
    $category = ProjectCategory::factory()->create();

    // Daten für das neue Projekt
    $data = [
        'name' => 'Test Project',
        'project_category_id' => $category->id,
        'note' => 'This is a test project',
        'owner_contact_id' => $this->contact->id,
    ];

    // Führe den Test aus (keep tenancy initialized for actingAs to work)
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://' . $this->domain->domain . '/app/projects', $data);

    // Debug
    dump('Redirect location: ' . $response->headers->get('Location'));
    dump('Session errors: ' . json_encode($response->getSession()->get('errors')));
    dump('All projects: ' . Project::count());

    // Überprüfe die Antwort
    $response->assertRedirect();
    $response->assertSessionHasNoErrors();

    // Überprüfe, dass das Projekt in der Datenbank existiert
    $this->assertDatabaseHas('projects', [
        'name' => 'Test Project',
        'project_category_id' => $category->id,
    ]);
});

it('can show a project', function () {
    // Erstelle ein Projekt für den Tenant
    $project = Project::factory()->create();

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://' . $this->domain->domain . '/app/projects/' . $project->id);

    // Überprüfe die Antwort
    $response->assertStatus(200);
    $response->assertInertia(
        fn ($page) => $page
            ->component('App/Project/ProjectDetails')
            ->has('project')
            ->where('project.id', $project->id)
    );
});

it('can show the edit form for a project', function () {
    // Erstelle ein Projekt für den Tenant
    $project = Project::factory()->create();

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://' . $this->domain->domain . '/app/projects/' . $project->id . '/edit');

    // Überprüfe die Antwort
    $response->assertStatus(200);
    $response->assertInertia(
        fn ($page) => $page
            ->component('App/Project/ProjectEdit')
            ->has('project')
            ->where('project.id', $project->id)
    );
});

it('can update a project', function () {
    // Erstelle ein Projekt für den Tenant
    $project = Project::factory()->create();
    $category = ProjectCategory::factory()->create();

    // Daten für das Update
    $data = [
        'name' => 'Updated Project',
        'project_category_id' => $category->id,
        'note' => 'Updated description',
        'owner_contact_id' => $this->contact->id,
    ];

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://' . $this->domain->domain . '/app/projects/' . $project->id . '/edit', $data);

    // Überprüfe die Antwort
    $response->assertRedirect();
    $response->assertSessionHasNoErrors();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass das Projekt aktualisiert wurde
    $this->assertDatabaseHas('projects', [
        'id' => $project->id,
        'name' => 'Updated Project',
        'project_category_id' => $category->id,
    ]);
});

it('can upload an avatar for a project', function () {
    Storage::fake('s3');

    // Erstelle ein Projekt für den Tenant
    $project = Project::factory()->create();
    $category = ProjectCategory::factory()->create();

    // Erstelle eine temporäre Datei für den Upload
    $file = UploadedFile::fake()->image('avatar.jpg');

    // Daten für das Update
    $data = [
        'name' => 'Project with Avatar',
        'project_category_id' => $category->id,
        'owner_contact_id' => $this->contact->id,
        'avatar' => $file,
    ];

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://' . $this->domain->domain . '/app/projects/' . $project->id . '/edit', $data);

    // Überprüfe die Antwort
    $response->assertRedirect();
    $response->assertSessionHasNoErrors();

    // Überprüfe, dass die Datei hochgeladen wurde
    Storage::disk('s3')->assertExists('avatars/projects/' . $file->hashName());
});

it('can remove an avatar from a project', function () {
    Storage::fake('s3');

    // Erstelle ein Projekt für den Tenant
    $project = Project::factory()->create();
    $category = ProjectCategory::factory()->create();
    // Erstelle eine temporäre Datei für den Upload
    $file = UploadedFile::fake()->image('avatar.jpg');

    // Daten für das Update mit Avatar
    $data = [
        'name' => 'Project with Avatar',
        'avatar' => $file,
    ];

    Tenancy::end();

    // Lade den Avatar hoch
    $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://' . $this->domain->domain . '/app/projects/' . $project->id . '/edit', $data);

    // Daten für das Update ohne Avatar
    $data = [
        'name' => 'Project without Avatar',
        'project_category_id' => $category->id,
        'owner_contact_id' => $this->contact->id,
        'remove_avatar' => true,
    ];

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://' . $this->domain->domain . '/app/projects/' . $project->id . '/edit', $data);

    // Überprüfe die Antwort
    $response->assertRedirect();
    $response->assertSessionHasNoErrors();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass der Avatar entfernt wurde
    $this->assertNull($project->fresh()->firstMedia('avatar'));
});

it('can archive a project', function () {
    // Erstelle ein Projekt für den Tenant
    $project = Project::factory()->create(['is_archived' => false]);

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://' . $this->domain->domain . '/app/projects/' . $project->id . '/archive');

    // Überprüfe die Antwort
    $response->assertRedirect();
    $response->assertSessionHasNoErrors();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass das Projekt archiviert wurde
    $this->assertTrue($project->fresh()->is_archived);
});

it('can unarchive a project', function () {
    // Erstelle ein Projekt für den Tenant
    $project = Project::factory()->create(['is_archived' => true]);

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://' . $this->domain->domain . '/app/projects/' . $project->id . '/archive');

    // Überprüfe die Antwort
    $response->assertRedirect();
    $response->assertSessionHasNoErrors();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass das Projekt nicht mehr archiviert ist
    $this->assertFalse($project->fresh()->is_archived);
});

it('can delete a project', function () {
    // Erstelle ein Projekt für den Tenant
    $project = Project::factory()->create();

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->delete('http://' . $this->domain->domain . '/app/projects/' . $project->id);

    // Überprüfe die Antwort
    $response->assertRedirect();
    $response->assertSessionHasNoErrors();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass das Projekt gelöscht wurde
    $this->assertSoftDeleted('projects', ['id' => $project->id]);
});

it('isolates projects between tenants', function () {
    // Erstelle einen zweiten Tenant
    $tenant2 = Tenant::factory()->create();
    $domain2 = Domain::create(['tenant_id' => $tenant2->id, 'domain' => 'tenant-' . $tenant2->id . '.test']);

    // Erstelle ein Projekt für den ersten Tenant
    $project1 = Project::factory()->create(['name' => 'Project for Tenant 1']);

    // Initialisiere den zweiten Tenant und führe Migrationen aus
    Tenancy::initialize($tenant2);
    $this->artisan('tenants:migrate');

    // Erstelle einen Benutzer für den zweiten Tenant
    $user2 = User::factory()->create();

    // Erstelle ein Projekt für den zweiten Tenant
    $project2 = Project::factory()->create(['name' => 'Project for Tenant 2']);

    // Überprüfe, dass der erste Tenant nur sein eigenes Projekt sieht
    Tenancy::end();
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://' . $this->domain->domain . '/app/projects');
    $response->assertStatus(200);
    $response->assertInertia(
        fn ($page) => $page
            ->has('projects.data', 1)
            ->where('projects.data.0.name', 'Project for Tenant 1')
    );

    // Überprüfe, dass der zweite Tenant nur sein eigenes Projekt sieht
    $response = $this
        ->actingAs($user2)
        ->withServerVariables(['HTTP_HOST' => $domain2->domain])
        ->get('http://' . $domain2->domain . '/app/projects');
    $response->assertStatus(200);
    $response->assertInertia(
        fn ($page) => $page
            ->has('projects.data', 1)
            ->where('projects.data.0.name', 'Project for Tenant 2')
    );
});

it('validates required fields when creating a project', function () {
    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://' . $this->domain->domain . '/app/projects', []);

    // Überprüfe, dass die Validierung fehlschlägt
    $response->assertSessionHasErrors(['name']);
});

it('validates required fields when updating a project', function () {
    // Erstelle ein Projekt für den Tenant
    $project = Project::factory()->create();

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://' . $this->domain->domain . '/app/projects/' . $project->id . '/edit', ['name' => '']);

    // Überprüfe, dass die Validierung fehlschlägt
    $response->assertSessionHasErrors(['name']);
});
