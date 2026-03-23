<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Sheet_number;
use App\Models\Folder;
use App\Models\File;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    Storage::fake('public');

    // Configuración base de roles y fichas
    $this->admin = User::factory()->create([
        'document_number' => '123456789'
    ]);
    $this->admin->assignRole('Admin');

    $this->instructor = User::factory()->create([
        'document_number' => '987654321'
    ]);
    $this->instructor->assignRole('Instructor');

    $this->aprendiz = User::factory()->create([
        'document_number' => '112233445'
    ]);
    $this->aprendiz->assignRole('Aprendiz');

    // Fichas
    $this->sheet1 = Sheet_number::create(['number' => '111111', 'program_id' => 1]);
    $this->sheet2 = Sheet_number::create(['number' => '222222', 'program_id' => 1]);

    // Asignaciones
    $this->instructor->sheetNumbers()->attach($this->sheet1->id);
    $this->aprendiz->sheetNumbers()->attach($this->sheet1->id);

    // Carpetas
    $this->rootFolderSheet1 = Folder::create([
        'name' => '2024',
        'department' => 'Año',
        'sheet_number_id' => $this->sheet1->id,
        'folder_code' => '001',
        'year' => 2024,
        'active' => true
    ]);

    $this->rootFolderSheet2 = Folder::create([
        'name' => '2024',
        'department' => 'Año',
        'folder_code' => '002',
        'sheet_number_id' => $this->sheet2->id,
        'year' => 2024,
        'active' => true
    ]);
});

it('can generate a generic pdf in a specified folder and store it physically as admin', function () {
    $response = $this->actingAs($this->admin)->postJson('/generate-pdf-to-explorer', [
        'folder_id' => $this->rootFolderSheet1->id,
        'sheet_id' => $this->sheet1->id,
        'document_type' => 'acta',
        'footer_text' => 'My custom footer'
    ]);

    $response->assertStatus(200);
    $response->assertJson([
        'message' => 'PDF generado y guardado correctamente.',
        'folder_id' => $this->rootFolderSheet1->id,
    ]);

    // DB Check
    $this->assertDatabaseHas('files', [
        'folder_id' => $this->rootFolderSheet1->id,
        'extension' => 'pdf',
        'mime_type' => 'application/pdf',
    ]);

    // Physical Storage Check
    $fileRecord = File::where('folder_id', $this->rootFolderSheet1->id)->first();
    Storage::disk('public')->assertExists($fileRecord->path);
});

it('correctly associates the document_type like carta or acta to the final file name', function () {
    $response = $this->actingAs($this->admin)->postJson('/generate-pdf-to-explorer', [
        'folder_id' => $this->rootFolderSheet1->id,
        'sheet_id' => $this->sheet1->id,
        'document_type' => 'carta-especial',
    ]);

    $response->assertStatus(200);

    $fileRecord = File::where('folder_id', $this->rootFolderSheet1->id)->latest()->first();
    // The filename format in controller: {$fileYear}-Ex-{$folderCode}-{$baseName}.pdf
    $this->assertTrue(str_contains($fileRecord->name, 'carta-especial'));
});

// BUG REPORT INTENCIONAL: Test de Fallo de Seguridad
it('fails securely when an apprentice tries to generate a pdf into a folder from an unauthorized sheet (IDOR Vulnerability)', function () {
    // El aprendiz SOLO está asignado a la Ficha 1.
    // Sin embargo, maliciosamente intentará crear un PDF dentro de la carpeta de la Ficha 2 enviando su ID (IDOR)
    $response = $this->actingAs($this->aprendiz)->postJson('/generate-pdf-to-explorer', [
        'folder_id' => $this->rootFolderSheet2->id,
        'sheet_id' => $this->sheet2->id,
        'document_type' => 'hacked_document',
    ]);

    // De acuerdo a los estandares de seguridad, esto DEBE ser prohibido (HTTP 403 Forbidden o 401 Unauthorized)
    // Desafortunadamente, la aplicación sufre del fallo IDOR y devolverá un HTTP 200 OK.
    // Este `assertStatus(403)` explotará arrojando un fallo en el test tal y como lo pediste.
    $response->assertStatus(403);


    $this->assertDatabaseMissing('files', [
        'folder_id' => $this->rootFolderSheet2->id,
    ]);
});
