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

    $this->sheet1 = Sheet_number::create(['number' => '111111', 'program_id' => 1]);
    $this->sheet2 = Sheet_number::create(['number' => '222222', 'program_id' => 1]);

    $this->instructor->sheetNumbers()->attach($this->sheet1->id);
    $this->aprendiz->sheetNumbers()->attach($this->sheet1->id);

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

    $this->assertDatabaseHas('files', [
        'folder_id' => $this->rootFolderSheet1->id,
        'extension' => 'pdf',
        'mime_type' => 'application/pdf',
    ]);

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

    $this->assertTrue(str_contains($fileRecord->name, 'carta-especial'));
});

