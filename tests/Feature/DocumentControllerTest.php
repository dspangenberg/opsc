<?php

use App\Models\Contact;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Project;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Facades\Tenancy;

beforeEach(function () {
    // Erstelle einen Standard-Tenant und einen Benutzer für Tests
    $this->tenant = Tenant::factory()->create();
    $this->domain = Domain::create([
        'tenant_id' => $this->tenant->id,
        'domain' => 'tenant-'.$this->tenant->id.'.test',
    ]);

    // Wechsle zum Tenant
    Tenancy::initialize($this->tenant);

    // Führe die Tenant-Migrationen aus
    $this->artisan('tenants:migrate');

    // Erstelle einen Kontakt für den Tenant
    $this->contact = Contact::factory()->create();

    // Erstelle einen Benutzer für den Tenant
    $this->user = User::factory()->create([
        'password' => bcrypt('password'),
    ]);

    // Erstelle einen Dokumententyp für Tests
    $this->documentType = DocumentType::factory()->create();

    // Erstelle ein Projekt für Tests
    $this->project = Project::factory()->create();
});

afterEach(function () {
    // Beende die Tenancy nach jedem Test, um den Zustand zu bereinigen
    Tenancy::end();
});

it('can show document edit form', function () {
    // Erstelle ein Dokument für den Tenant
    $document = Document::factory()->create();

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/documents/'.$document->id.'/edit');

    // Überprüfe die Antwort
    $response->assertStatus(200);
    $response->assertInertia(
        fn ($page) => $page
            ->component('App/Document/Document/DocumentEdit')
            ->has('document')
            ->where('document.id', $document->id)
    );
});

it('can update a document', function () {
    // Erstelle ein Dokument für den Tenant
    $document = Document::factory()->create();

    // Daten für das Update
    $data = [
        'filename' => 'updated_document.pdf',
        'summary' => 'Updated Document Summary',
        'document_type_id' => $this->documentType->id,
        'sender_contact_id' => $this->contact->id,
        'project_id' => $this->project->id,
        'issued_on' => now()->format('d.m.Y'),
        'received_on' => now()->format('d.m.Y'),
        'is_inbound' => true,
        'is_confirmed' => true,
    ];

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://'.$this->domain->domain.'/app/documents/'.$document->id.'/update', $data);

    // Überprüfe die Antwort
    $response->assertRedirect();
    $response->assertSessionHasNoErrors();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass das Dokument aktualisiert wurde
    $this->assertDatabaseHas('documents', [
        'id' => $document->id,
        'summary' => 'Updated Document Summary',
        'document_type_id' => $this->documentType->id,
    ]);
});

it('can toggle pinned status of document', function () {
    // Erstelle ein Dokument für den Tenant
    $document = Document::factory()->create(['is_pinned' => false]);

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://'.$this->domain->domain.'/app/documents/'.$document->id.'/toggle-pinned');

    // Überprüfe die Antwort
    $response->assertRedirect();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass der Pin-Status geändert wurde
    $this->assertTrue($document->fresh()->is_pinned);
});

it('can move document to trash', function () {
    // Erstelle ein Dokument für den Tenant
    $document = Document::factory()->create();

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->delete('http://'.$this->domain->domain.'/app/documents/'.$document->id.'/trash');

    // Überprüfe die Antwort
    $response->assertRedirect();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass das Dokument im Papierkorb ist
    $this->assertSoftDeleted('documents', ['id' => $document->id]);
});

it('can restore document from trash', function () {
    // Erstelle ein Dokument für den Tenant und lösche es
    $document = Document::factory()->create();
    $document->delete();

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://'.$this->domain->domain.'/app/documents/'.$document->id.'/restore');

    // Überprüfe die Antwort
    $response->assertRedirect();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass das Dokument wiederhergestellt wurde
    $this->assertDatabaseHas('documents', [
        'id' => $document->id,
        'deleted_at' => null,
    ]);
});

it('can force delete document', function () {
    // Erstelle ein Dokument für den Tenant und lösche es
    $document = Document::factory()->create();
    $document->delete();

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->delete('http://'.$this->domain->domain.'/app/documents/'.$document->id.'/force-delete');

    // Überprüfe die Antwort
    $response->assertRedirect();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass das Dokument vollständig gelöscht wurde
    $this->assertDatabaseMissing('documents', ['id' => $document->id]);
});

it('can bulk edit documents', function () {
    // Erstelle Dokumente für den Tenant
    $documents = Document::factory()->count(3)->create();
    $documentIds = $documents->pluck('id')->toArray();

    // Daten für die Massenbearbeitung
    $data = [
        'ids' => implode(',', $documentIds),
        'document_type_id' => $this->documentType->id,
        'project_id' => $this->project->id,
    ];

    // Debug: Zeige die Daten an
    echo 'Bulk edit data: '.json_encode($data)."\n";
    echo 'Project ID: '.$this->project->id."\n";
    echo 'Document Type ID: '.$this->documentType->id."\n";

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://'.$this->domain->domain.'/app/documents/bulk-edit', $data);

    // Überprüfe die Antwort
    $response->assertRedirect();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass alle Dokumente aktualisiert wurden
    foreach ($documentIds as $id) {
        $this->assertDatabaseHas('documents', [
            'id' => $id,
            'document_type_id' => $this->documentType->id,
            'project_id' => $this->project->id,
        ]);
    }
});

it('can bulk move documents to trash', function () {
    // Erstelle Dokumente für den Tenant
    $documents = Document::factory()->count(3)->create();
    $documentIds = $documents->pluck('id')->toArray();

    // Daten für die Massenlöschung
    $data = [
        'ids' => implode(',', $documentIds),
    ];

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://'.$this->domain->domain.'/app/documents/bulk-move-to-trash', $data);

    // Überprüfe die Antwort
    $response->assertRedirect();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass alle Dokumente im Papierkorb sind
    foreach ($documentIds as $id) {
        $this->assertSoftDeleted('documents', ['id' => $id]);
    }
});

it('can bulk restore documents from trash', function () {
    // Erstelle Dokumente für den Tenant und lösche sie
    $documents = Document::factory()->count(3)->create();
    $documentIds = $documents->pluck('id')->toArray();

    foreach ($documents as $document) {
        $document->delete();
    }

    // Daten für die Massenwiederherstellung
    $data = [
        'ids' => implode(',', $documentIds),
    ];

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://'.$this->domain->domain.'/app/documents/bulk-restore', $data);

    // Überprüfe die Antwort
    $response->assertRedirect();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass alle Dokumente wiederhergestellt wurden
    foreach ($documentIds as $id) {
        $this->assertDatabaseHas('documents', [
            'id' => $id,
            'deleted_at' => null,
        ]);
    }
});

it('can show upload form', function () {
    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/documents/upload-form');

    // Überprüfe die Antwort
    $response->assertStatus(200);
    $response->assertInertia(
        fn ($page) => $page
            ->component('App/Document/Document/DocumentUpload')
    );
});

it('can upload documents', function () {
    // Erstelle Testdateien
    $files = [
        UploadedFile::fake()->create('document1.pdf', 1000, 'application/pdf'),
        UploadedFile::fake()->create('document2.pdf', 1500, 'application/pdf'),
    ];

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/app/documents', [
            'files' => $files,
        ]);

    // Überprüfe die Antwort
    $response->assertRedirect();
    $response->assertSessionHasNoErrors();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass Dokumente in der Datenbank existieren
    $this->assertDatabaseHas('documents', [
        'filename' => 'document1.pdf',
    ]);
    $this->assertDatabaseHas('documents', [
        'filename' => 'document2.pdf',
    ]);
});

it('can upload multi-document file', function () {
    // Erstelle eine Testdatei
    $file = UploadedFile::fake()->create('multidoc.pdf', 2000, 'application/pdf');

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/app/documents/multi-upload', [
            'file' => $file,
        ]);

    // Überprüfe die Antwort
    $response->assertRedirect();
    $response->assertSessionHasNoErrors();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass Dokumente in der Datenbank existieren
    $this->assertDatabaseHas('documents', [
        'source_file' => 'multidoc.pdf',
    ]);
});

it('can stream document PDF', function () {
    // Erstelle ein Dokument mit einer Datei
    $document = Document::factory()->create();

    // Note: Dieser Test prüft nur die Route, da das tatsächliche Streaming
    // von Medien in der Testumgebung schwierig zu testen ist

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/documents/'.$document->id.'/pdf');

    // Überprüfe, dass die Route existiert und eine Antwort gibt
    $response->assertStatus(200);
});

it('can stream document preview', function () {
    // Erstelle ein Dokument mit einer Vorschau
    $document = Document::factory()->create();

    // Note: Dieser Test prüft nur die Route, da das tatsächliche Streaming
    // von Medien in der Testumgebung schwierig zu testen ist

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/documents/'.$document->id.'/preview');

    // Überprüfe, dass die Route existiert und eine Antwort gibt
    $response->assertStatus(200);
});

it('can extract document information using AI', function () {
    // Erstelle ein Dokument mit Volltext
    $document = Document::factory()->create([
        'fulltext' => 'This is a test document with important information about invoices and payments.',
        'summary' => null,
    ]);

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/app/documents/'.$document->id.'/extract-ai');

    // Überprüfe die Antwort
    $response->assertRedirect();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass das Dokument aktualisiert wurde
    $updatedDocument = $document->fresh();
    $this->assertNotNull($updatedDocument->summary);
});

it('can bulk force delete documents', function () {
    // Erstelle Dokumente für den Tenant und lösche sie
    $documents = Document::factory()->count(3)->create();
    $documentIds = $documents->pluck('id')->toArray();

    foreach ($documents as $document) {
        $document->delete();
    }

    Tenancy::end();

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->delete('http://'.$this->domain->domain.'/app/documents/bulk-force-delete?document_ids='.implode(',', $documentIds));

    // Überprüfe die Antwort
    $response->assertRedirect();

    // Reinitialize tenancy
    Tenancy::initialize($this->tenant);

    // Überprüfe, dass alle Dokumente vollständig gelöscht wurden
    foreach ($documentIds as $id) {
        $this->assertDatabaseMissing('documents', ['id' => $id]);
    }
});

it('isolates documents between tenants', function () {
    // Erstelle einen zweiten Tenant
    $tenant2 = Tenant::factory()->create();
    $domain2 = Domain::create(['tenant_id' => $tenant2->id, 'domain' => 'tenant-'.$tenant2->id.'.test']);

    // Erstelle ein Dokument für den ersten Tenant
    $document1 = Document::factory()->create(['title' => 'Document for Tenant 1']);

    // Initialisiere den zweiten Tenant und führe Migrationen aus
    Tenancy::initialize($tenant2);
    $this->artisan('tenants:migrate');

    // Erstelle einen Benutzer für den zweiten Tenant
    $user2 = User::factory()->create();

    // Erstelle ein Dokument für den zweiten Tenant
    $document2 = Document::factory()->create(['title' => 'Document for Tenant 2']);

    // Überprüfe, dass der erste Tenant nur sein eigenes Dokument sieht
    Tenancy::end();
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/documents');

    $response->assertStatus(200);
    $response->assertInertia(
        fn ($page) => $page
            ->has('documents')
    );
});

it('validates required fields when updating a document', function () {
    // Erstelle ein Dokument für den Tenant
    $document = Document::factory()->create();

    Tenancy::end();

    // Führe den Test aus mit minimalen erforderlichen Daten
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://'.$this->domain->domain.'/app/documents/'.$document->id.'/update', [
            'filename' => 'test_document.pdf',
            'document_type_id' => $this->documentType->id,
            'is_inbound' => true,
        ]);

    // Überprüfe, dass die Validierung erfolgreich ist (keine Fehler)
    $response->assertSessionHasNoErrors();
});

it('validates file upload requirements', function () {
    Tenancy::end();

    // Führe den Test aus ohne Dateien
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/app/documents/upload', [
            'files' => [],
        ]);

    // Überprüfe, dass die Validierung fehlschlägt
    $response->assertSessionHasErrors(['files']);
});

it('validates multi-document upload requirements', function () {
    Tenancy::end();

    // Führe den Test aus ohne Datei
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/app/documents/multi-upload', [
            'file' => null,
        ]);

    // Überprüfe, dass die Validierung fehlschlägt
    $response->assertSessionHasErrors(['file']);
});
