<?php

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

    // Erstelle einen Benutzer für den Tenant
    $this->user = User::factory()->create([
        'password' => bcrypt('password'),
    ]);
});

afterEach(function () {
    // Beende die Tenancy nach jedem Test, um den Zustand zu bereinigen
    Tenancy::end();
});

it('validates file upload requirements', function () {
    Tenancy::end();

    // Teste mit ungültigen Daten - keine Dateien
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/app/documents', [
            // Keine Dateien gesendet
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

it('validates file type for uploads', function () {
    Tenancy::end();

    // Teste mit ungültigem Dateityp
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/app/documents', [
            'files' => [
                UploadedFile::fake()->create('document.txt', 1000, 'text/plain'),
            ],
        ]);

    // Überprüfe, dass die Validierung fehlschlägt
    $response->assertSessionHasErrors(['files.0']);
});

it('validates file size for uploads', function () {
    Tenancy::end();

    // Teste mit zu großer Datei (60MB > 50MB Limit)
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/app/documents', [
            'files' => [
                UploadedFile::fake()->create('large.pdf', 60000, 'application/pdf'),
            ],
        ]);

    // Überprüfe, dass die Validierung fehlschlägt
    $response->assertSessionHasErrors(['files.0']);
});

it('validates file count limit for uploads', function () {
    Tenancy::end();

    // Teste mit zu vielen Dateien (11 > 10 Limit)
    $tooManyFiles = [];
    for ($i = 0; $i < 11; $i++) {
        $tooManyFiles[] = UploadedFile::fake()->create("document{$i}.pdf", 1000, 'application/pdf');
    }

    // Führe den Test aus
    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/app/documents', [
            'files' => $tooManyFiles,
        ]);

    // Überprüfe, dass die Validierung fehlschlägt
    $response->assertSessionHasErrors(['files']);
});
