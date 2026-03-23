<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Sheet_number;
use App\Models\Folder;
use App\Models\File;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
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
    $this->aprendiz->sheetNumbers()->attach($this->sheet1->id); // Aprendiz en ficha 1
    // No le asignamos la ficha 2 a instructor y aprendiz

    // Carpetas
    $this->rootFolderSheet1 = Folder::create([
        'name' => '2024',
        'department' => 'Año',
        'sheet_number_id' => $this->sheet1->id,
        'year' => 2024,
        'active' => true
    ]);

    $this->rootFolderSheet2 = Folder::create([
        'name' => '2024',
        'department' => 'Año',
        'sheet_number_id' => $this->sheet2->id,
        'year' => 2024,
        'active' => true
    ]);

    $this->subFolderSheet1 = Folder::create([
        'name' => 'Ventanilla unica',
        'parent_id' => $this->rootFolderSheet1->id,
        'sheet_number_id' => $this->sheet1->id,
        'department' => 'sección',
        'active' => true
    ]);
});

// --- ROLE BASED ACCESS ---

it('allows Admin to see all folders in the explorer regardless of sheet', function () {
    $response = $this->actingAs($this->admin)->get('/explorer?sheet_id=' . $this->sheet2->id);
    $response->assertStatus(200);
    // Asumiendo que el controlador renderiza la vista de Inertia con los folders correctos
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Explorer')
        ->has('folders')
    );
});

it('allows Instructor to see folders for assigned sheets', function () {
    $response = $this->actingAs($this->instructor)->get('/explorer?sheet_id=' . $this->sheet1->id);
    $response->assertStatus(200);
});

// NOTA: El controlador FolderController no verifica roles actualmente. Dejamos que falle, o que pase si hay middleware global.
it('prevents Instructor from seeing folders for unassigned sheets', function () {
    $response = $this->actingAs($this->instructor)->get('/explorer?sheet_id=' . $this->sheet2->id); // Ficha 2 no está asignada
    // Si la seguridad de backend funciona, debería dar 403 o no retornar folders de esta ficha.
    // Actualmente FolderController solo filtra "$foldersQuery->where('sheet_number_id', $sheetId);". No chequea roles.
    // Esto expondrá el error.
    if ($response->status() !== 403) {
        // Asserting that length is 0 if no 403 (Assuming backend shouldn't return other's data)
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Explorer')
            ->where('folders', []) // Debería estar vacío o prohibido
        );
    } else {
        $response->assertForbidden();
    }
});

it('prevents Aprendiz from seeing folders for unassigned sheets', function () {
    $response = $this->actingAs($this->aprendiz)->get('/explorer?sheet_id=' . $this->sheet2->id); // Ficha 2 no está asignada
    if ($response->status() !== 403) {
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Explorer')
            ->where('folders', []) // Debería estar vacío o prohibido
        );
    } else {
        $response->assertForbidden();
    }
});

// --- FOLDER OPERATIONS ---

it('automatically creates a Year folder when parent is null and sheet_number_id is provided', function () {
    $response = $this->actingAs($this->admin)->post('/api/folders', [
        'name' => '2025',
        'department' => 'Año',
        'sheet_number_id' => $this->sheet1->id,
        'parent_id' => null
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('folders', [
        'name' => '2025',
        'department' => 'Año',
        'year' => 2025,
        'sheet_number_id' => $this->sheet1->id
    ]);
});

it('updates a folder successfully', function () {
    $response = $this->actingAs($this->admin)->put('/api/folders/' . $this->subFolderSheet1->id, [
        'name' => 'Nueva Ventanilla',
        'department' => 'sección'
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('folders', [
        'id' => $this->subFolderSheet1->id,
        'name' => 'Nueva Ventanilla'
    ]);
});

// --- UPLOAD & HASH DETECTION ---

it('uploads files and returns unique hash properties without failing', function () {
    // This is the bug the user mentioned: "cada elemento tiene un hash unico creo que no esta mostrando eso es un error deja a prueba asi no pase"
    $file = UploadedFile::fake()->create('documento.pdf', 100);

    $response = $this->actingAs($this->admin)->post("/api/folders/{$this->subFolderSheet1->id}/upload", [
        'files' => [$file]
    ]);

    $response->assertSessionHasNoErrors();

    // Verify DB
    $this->assertDatabaseHas('files', [
        'folder_id' => $this->subFolderSheet1->id,
        'extension' => 'pdf'
    ]);

    // Usually we would expect the response to be JSON returning the files with hashes, 
    // but the controller currently does `return back()`.
    // We will simulate the `explorer` call to retrieve the file and verify it exposes the hash for the frontend.
    $explorerResponse = $this->actingAs($this->admin)->get("/explorer?folder_id={$this->subFolderSheet1->id}");
    
    // Debería tener los archivos en Inertia props.
    // Esto fallará intencionalmente si no se mapea 'hash' o si fallara algo en Inertia.
    // Actually, el FolderController sí mapea "hash" => $file->hash en get('/explorer').
    // Si falla, dejaremos que la prueba falle.
    $explorerResponse->assertInertia(fn (Assert $page) => $page
        ->component('Explorer')
        ->has('files', 1, fn (Assert $page) => $page
            ->has('hash')   // <-- Este es el requerimiento que falla o pasa.
            ->etc()
        )
    );
});

// --- DOWNLOADS ---

it('downloads a specific file', function () {
    $file = UploadedFile::fake()->create('test_download.pdf', 100);
    Storage::disk('public')->put("folders/{$this->subFolderSheet1->id}/test_download.pdf", $file->getContent());

    $dbFile = File::create([
        'name' => 'test_download.pdf',
        'path' => "folders/{$this->subFolderSheet1->id}/test_download.pdf",
        'extension' => 'pdf',
        'mime_type' => 'application/pdf',
        'size' => 100,
        'folder_id' => $this->subFolderSheet1->id,
        'active' => true,
        'file_code' => '001',
        'hash' => 'dummyhash123'
    ]);

    // The download route is `GET /folders/file/download/{file}` using web.php ? or api.php
    $response = $this->actingAs($this->admin)->get("/api/folders/file/download/{$dbFile->id}");
    $response->assertStatus(200);
    $response->assertDownload('test_download.pdf');
});

it('downloads multiple items as a mixed ZIP archive', function () {
    $response = $this->actingAs($this->admin)->post('/api/folders/download-mixed-zip', [
        'folders' => [$this->subFolderSheet1->id],
        'files' => []
    ]);

    $response->assertStatus(200);
    // Usually download returns a DownloadResponse ending in .zip
    $this->assertTrue(str_contains($response->headers->get('Content-Disposition'), '.zip'));
});

// --- TRASH SYSTEM & MOVES ---

it('logically deletes folders and files (moves to trash)', function () {
    $response = $this->actingAs($this->admin)->post('/api/folders/delete-mixed', [
        'folders' => [$this->subFolderSheet1->id]
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('folders', [
        'id' => $this->subFolderSheet1->id,
        'active' => 0
    ]);
});

it('lists archived (trashed) items correctly', function () {
    // Deactivate first
    $this->subFolderSheet1->update(['active' => false]);

    $response = $this->actingAs($this->admin)->get('/folders/archived?sheet_id=' . $this->sheet1->id);
    
    // This is an API endpoint as per the previous code (returns response()->json(...))
    $response->assertStatus(200);
    $data = $response->json();
    $this->assertTrue($data['success']);
    // Debería contener la carpeta archivada
    $this->assertCount(1, $data['folders']);
    $this->assertEquals($this->subFolderSheet1->id, $data['folders'][0]['id']);
});

it('restores folders from trash', function () {
    $this->subFolderSheet1->update(['active' => false]);

    $response = $this->actingAs($this->admin)->post('/folders/restore-mixed', [
        'folders' => [$this->subFolderSheet1->id] // Usa /api/ o web, pero según el controlador ambos apuntan a restoreMixed
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('folders', [
        'id' => $this->subFolderSheet1->id,
        'active' => 1
    ]);
});

it('moves mixed items to another target folder', function () {
    $targetFolder = Folder::create([
        'name' => 'Target',
        'department' => 'sección',
        'sheet_number_id' => $this->sheet1->id,
        'active' => true
    ]);

    $response = $this->actingAs($this->admin)->post('/folders/move-mixed', [
        'folders' => [$this->subFolderSheet1->id],
        'target_folder_id' => $targetFolder->id
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('folders', [
        'id' => $this->subFolderSheet1->id,
        'parent_id' => $targetFolder->id
    ]);
});

