<?php

namespace Tests\Feature\App;

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
use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->faker = \Faker\Factory::create();

        // Erstelle einen Standard-Tenant und einen Benutzer für Tests
        $this->tenant = Tenant::factory()->create();
        $this->domain = Domain::create([
            'tenant_id' => $this->tenant->id, 
            'domain' => $this->faker->unique()->domainName()
        ]);
        
        // Überprüfe, ob die Domain korrekt erstellt wurde
        $this->assertNotNull($this->domain);
        $this->assertEquals($this->tenant->id, $this->domain->tenant_id);
        
        // Wechsle zum Tenant
        Tenancy::initialize($this->tenant);

        // Führe die Tenant-Migrationen aus
        $this->artisan('tenants:migrate');

        // Erstelle einen Benutzer für den Tenant
        $this->user = User::factory()->create([
            'password' => bcrypt('password'),
        ]);
        $this->actingAs($this->user);

        // Stelle sicher, dass die Tenant-Initialisierung korrekt durchgeführt wurde
        $this->assertTrue(tenancy()->initialized);
        $this->assertEquals($this->tenant->id, tenancy()->tenant->id);
    }

    public function test_it_can_list_projects_for_tenant()
    {
        // Erstelle Projekte für den Tenant
        $projects = Project::factory()->count(3)->create(['is_archived' => false]);

        // Überprüfe, ob die Route im Tenant-Kontext verfügbar ist
        $this->assertTrue(route('app.project.index', absolute: false) !== null);

        // Führe den Test aus
        $response = $this->withServerVariables(['HTTP_HOST' => $this->domain->domain])
            ->get('/app/projects');

        // Überprüfe die Antwort
        $response->assertStatus(200);
        $response->assertInertia(
            fn ($page) => $page
                ->component('App/Project/ProjectIndex')
                ->has('projects.data', 3)
        );
    }

    /**  */
    public function test_can_create_a_project()
    {
        // Erstelle eine Kategorie für den Tenant
        $category = ProjectCategory::factory()->create();

        // Daten für das neue Projekt
        $data = [
            'name' => 'Test Project',
            'category_id' => $category->id,
            'description' => 'This is a test project',
        ];

        // Führe den Test aus
        $response = $this->post(route('app.project.store'), $data);

        // Überprüfe die Antwort
        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        // Überprüfe, dass das Projekt in der Datenbank existiert
        $this->assertDatabaseHas('projects', [
            'name' => 'Test Project',
            'category_id' => $category->id,
        ]);
    }

    /**  */
    public function test_can_show_a_project()
    {
        // Erstelle ein Projekt für den Tenant
        $project = Project::factory()->create();

        // Führe den Test aus
        $response = $this->get(route('app.project.details', $project));

        // Überprüfe die Antwort
        $response->assertStatus(200);
        $response->assertInertia(
            fn ($page) => $page
                ->component('App/Project/ProjectDetails')
                ->has('project.data', fn ($projectData) => $projectData['id'] === $project->id)
        );
    }

    /**  */
    public function test_can_show_the_edit_form_for_a_project()
    {
        // Erstelle ein Projekt für den Tenant
        $project = Project::factory()->create();

        // Führe den Test aus
        $response = $this->get(route('app.project.edit', $project));

        // Überprüfe die Antwort
        $response->assertStatus(200);
        $response->assertInertia(
            fn ($page) => $page
                ->component('App/Project/ProjectEdit')
                ->has('project.data', fn ($projectData) => $projectData['id'] === $project->id)
        );
    }

    /**  */
    public function test_can_update_a_project()
    {
        // Erstelle ein Projekt für den Tenant
        $project = Project::factory()->create();
        $category = ProjectCategory::factory()->create();

        // Daten für das Update
        $data = [
            'name' => 'Updated Project',
            'category_id' => $category->id,
            'description' => 'Updated description',
        ];

        // Führe den Test aus
        $response = $this->put(route('app.project.update', $project), $data);

        // Überprüfe die Antwort
        $response->assertRedirect(route('app.project.details', $project));
        $response->assertSessionHasNoErrors();

        // Überprüfe, dass das Projekt aktualisiert wurde
        $this->assertDatabaseHas('projects', [
            'id' => $project->id,
            'name' => 'Updated Project',
            'category_id' => $category->id,
        ]);
    }

    /**  */
    public function test_can_upload_an_avatar_for_a_project()
    {
        Storage::fake('s3');

        // Erstelle ein Projekt für den Tenant
        $project = Project::factory()->create();

        // Erstelle eine temporäre Datei für den Upload
        $file = UploadedFile::fake()->image('avatar.jpg');

        // Daten für das Update
        $data = [
            'name' => 'Project with Avatar',
            'avatar' => $file,
        ];

        // Führe den Test aus
        $response = $this->put(route('app.project.update', $project), $data);

        // Überprüfe die Antwort
        $response->assertRedirect(route('app.project.details', $project));
        $response->assertSessionHasNoErrors();

        // Überprüfe, dass die Datei hochgeladen wurde
        Storage::disk('s3')->assertExists('avatars/projects/' . $file->hashName());
    }

    /**  */
    public function test_can_remove_an_avatar_from_a_project()
    {
        Storage::fake('s3');

        // Erstelle ein Projekt für den Tenant
        $project = Project::factory()->create();

        // Erstelle eine temporäre Datei für den Upload
        $file = UploadedFile::fake()->image('avatar.jpg');

        // Daten für das Update mit Avatar
        $data = [
            'name' => 'Project with Avatar',
            'avatar' => $file,
        ];

        // Lade den Avatar hoch
        $this->put(route('app.project.update', $project), $data);

        // Daten für das Update ohne Avatar
        $data = [
            'name' => 'Project without Avatar',
            'remove_avatar' => true,
        ];

        // Führe den Test aus
        $response = $this->put(route('app.project.update', $project), $data);

        // Überprüfe die Antwort
        $response->assertRedirect(route('app.project.details', $project));
        $response->assertSessionHasNoErrors();

        // Überprüfe, dass der Avatar entfernt wurde
        $this->assertNull($project->fresh()->firstMedia('avatar'));
    }

    /**  */
    public function test_can_archive_a_project()
    {
        // Erstelle ein Projekt für den Tenant
        $project = Project::factory()->create(['is_archived' => false]);

        // Führe den Test aus
        $response = $this->put(route('app.project.archive', $project));

        // Überprüfe die Antwort
        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        // Überprüfe, dass das Projekt archiviert wurde
        $this->assertTrue($project->fresh()->is_archived);
    }

    /**  */
    public function test_can_unarchive_a_project()
    {
        // Erstelle ein Projekt für den Tenant
        $project = Project::factory()->create(['is_archived' => true]);

        // Führe den Test aus
        $response = $this->put(route('app.project.archive', $project));

        // Überprüfe die Antwort
        $response->assertRedirect();
        $response->assertSessionHasNoErrors();

        // Überprüfe, dass das Projekt nicht mehr archiviert ist
        $this->assertFalse($project->fresh()->is_archived);
    }

    /**  */
    public function test_can_delete_a_project()
    {
        // Erstelle ein Projekt für den Tenant
        $project = Project::factory()->create();

        // Führe den Test aus
        $response = $this->delete(route('app.project.trash', $project));

        // Überprüfe die Antwort
        $response->assertRedirect(route('app.project.index'));
        $response->assertSessionHasNoErrors();

        // Überprüfe, dass das Projekt gelöscht wurde
        $this->assertSoftDeleted($project);
    }

    /**  */
    public function test_isolates_projects_between_tenants()
    {
        // Erstelle einen zweiten Tenant
        $tenant2 = Tenant::factory()->create();
        $domain2 = Domain::factory()->create(['tenant_id' => $tenant2->id]);

        // Erstelle ein Projekt für den ersten Tenant
        Tenancy::initialize($this->tenant);
        $project1 = Project::factory()->create(['name' => 'Project for Tenant 1']);

        // Erstelle ein Projekt für den zweiten Tenant
        Tenancy::initialize($tenant2);
        $project2 = Project::factory()->create(['name' => 'Project for Tenant 2']);

        // Überprüfe, dass der erste Tenant nur sein eigenes Projekt sieht
        Tenancy::initialize($this->tenant);
        $response = $this->get(route('app.project.index'));
        $response->assertInertia(
            fn ($page) => $page
                ->has('projects.data', 1)
                ->where('projects.data.0.name', 'Project for Tenant 1')
        );

        // Überprüfe, dass der zweite Tenant nur sein eigenes Projekt sieht
        Tenancy::initialize($tenant2);
        $response = $this->get(route('app.project.index'));
        $response->assertInertia(
            fn ($page) => $page
                ->has('projects.data', 1)
                ->where('projects.data.0.name', 'Project for Tenant 2')
        );
    }

    /**  */
    public function test_validates_required_fields_when_creating_a_project()
    {
        // Führe den Test aus
        $response = $this->post(route('app.project.store'), []);

        // Überprüfe, dass die Validierung fehlschlägt
        $response->assertSessionHasErrors(['name']);
    }

    /**  */
    public function test_validates_required_fields_when_updating_a_project()
    {
        // Erstelle ein Projekt für den Tenant
        $project = Project::factory()->create();

        // Führe den Test aus
        $response = $this->put(route('app.project.update', $project), ['name' => '']);

        // Überprüfe, dass die Validierung fehlschlägt
        $response->assertSessionHasErrors(['name']);
    }
}
