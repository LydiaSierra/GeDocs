<?php

namespace Tests\Feature\Shared;

use App\Models\User;
use App\Models\Sheet_number;
use App\Models\Folder;
use App\Models\File;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
    Storage::fake('public');
    
    // Configuración base de roles y fichas
    $this->admin = User::factory()->create([
        'document_number' => '123456789'
    ]);
    $this->admin->assignRole('Admin');

    // Ficha
    $this->sheet = Sheet_number::create(['number' => '999999', 'program_id' => 1]);
});

it('automatically creates and returns the current year folder for the electronic index when accessing root of a valid sheet', function () {
    $currentYear = date('Y');
    
    // Al acceder a /explorer?sheet_id=... sin folder_id ni buscador,
    // se debe crear automáticamente el folder del año actual si no existe.
    $response = $this->actingAs($this->admin)
        ->get('/explorer?sheet_id=' . $this->sheet->id);

    $response->assertStatus(200);

    // Verificar en BD que se creó la carpeta del año actual
    $this->assertDatabaseHas('folders', [
        'sheet_number_id' => $this->sheet->id,
        'year' => $currentYear,
        'department' => 'Año',
        'active' => true,
    ]);

    // Verificar la respuesta Inertia para asegurarse de que retorna las carpetas raíz (incluida la del año)
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Explorer')
        ->has('folders', 1, fn (Assert $page) => $page
            ->where('year', (int)$currentYear)
            ->etc()
        )
    );
});

it('returns files associated with a specific year folder in the electronic index', function () {
    $currentYear = date('Y');
    
    // Crear la carpeta del año
    $yearFolder = Folder::create([
        'name' => (string)$currentYear,
        'department' => 'Año',
        'sheet_number_id' => $this->sheet->id,
        'year' => $currentYear,
        'active' => true
    ]);

    // Crear un archivo pdf en esa carpeta
    $file = File::create([
        'name' => 'Documento-Electronico.pdf',
        'path' => "folders/{$yearFolder->id}/doc.pdf",
        'extension' => 'pdf',
        'mime_type' => 'application/pdf',
        'size' => 1024,
        'folder_id' => $yearFolder->id,
        'active' => true,
        'hash' => 'dummyhash123'
    ]);

    // Cuando el frontend (Electronic Index) solicita los datos de esa carpeta
    $response = $this->actingAs($this->admin)
        ->get("/explorer?sheet_id={$this->sheet->id}&folder_id={$yearFolder->id}");

    $response->assertStatus(200);

    // Verificar que el archivo está presente en los props de Inertia
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Explorer')
        ->has('files', 1, fn (Assert $page) => $page
            ->where('id', $file->id)
            ->where('name', 'Documento-Electronico.pdf')
            ->where('hash', 'dummyhash123')
            ->etc()
        )
    );
});
