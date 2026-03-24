<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Sheet_number;
use App\Models\Dependency;
use App\Models\Folder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

/**
 * Helper para crear usuarios con un rol específico.
 */
function createUserAdminWithRole(string $role, array $attributes = [])
{
    $defaultAttributes = [
        'type_document' => 'CC',
        'document_number' => (string) rand(10000000, 99999999), 
        'status' => 'active'
    ];
    
    $user = User::factory()->create(array_merge($defaultAttributes, $attributes));
    $user->assignRole($role);
    return $user;
}

// --- TEST 1: RESTRICCIÓN DE ROLES ---
it('prevents non-admin users from creating, editing or deleting sheets', function () {
    $instructor = createUserAdminWithRole('Instructor');
    $aprendiz = createUserAdminWithRole('Aprendiz');

    // Intentar POST
    $responsePostInst = $this->actingAs($instructor)->postJson('/api/sheets', ['number' => '12345']);
    $responsePostApr = $this->actingAs($aprendiz)->postJson('/api/sheets', ['number' => '12345']);

    $responsePostInst->assertForbidden(); // 403
    $responsePostApr->assertForbidden(); // 403

    // Verificar con un registro existente (Delete)
    $sheet = Sheet_number::create(['number' => '99999']);
    $responseDeleteInst = $this->actingAs($instructor)->deleteJson("/api/sheets/{$sheet->id}");
    
    // Debería proteger incluso si el rol falla
    $responseDeleteInst->assertForbidden();
});

// --- TEST 2: FLUJO DE CREACIÓN PERFECTO (FICHA -> VENTANILLA -> CARPETAS) ---
it('allows admin to create a sheet and automatically generates dependencies and folders', function () {
    $admin = createUserAdminWithRole('Admin');
    
    $payload = [
        'number' => '250100'
    ];

    $response = $this->actingAs($admin)
        ->postJson('/api/sheets', $payload);

    // Debe salir bien y retornar la ficha creada (Normalmente un 201 Created)
    $response->assertStatus(201);
    
    // Extrer el ID de la ficha creada de la respuesta
    $createdSheetId = $response->json('id');

    // 1. Validar que la ficha existe
    $this->assertDatabaseHas('sheet_numbers', [
        'id' => $createdSheetId,
        'number' => '250100',
    ]);

    // 2. Validar que se creó la Ventanilla Unica y está enlazada
    $this->assertDatabaseHas('dependencies', [
        'name' => 'Ventanilla Unica',
        'sheet_number_id' => $createdSheetId
    ]);

    // 3. Validar Ficha conectada al ID de su ventanilla
    $ventanilla = Dependency::where('sheet_number_id', $createdSheetId)->first();
    $this->assertDatabaseHas('sheet_numbers', [
        'id' => $createdSheetId,
        'ventanilla_unica_id' => $ventanilla->id
    ]);

    // 4. Validar Carpetas Anuales (Padre e hija Ventanilla)
    $currentYear = date('Y');
    
    $this->assertDatabaseHas('folders', [
        'name' => $currentYear,
        'year' => $currentYear,
        'department' => 'Año',
        'sheet_number_id' => $createdSheetId,
    ]);

    $yearFolder = Folder::where('name', $currentYear)->where('sheet_number_id', $createdSheetId)->first();

    $this->assertDatabaseHas('folders', [
        'name' => 'ventanilla unica',
        'parent_id' => $yearFolder->id,
        'department' => 'sección',
        'sheet_number_id' => $createdSheetId,
    ]);
});

// --- TEST 3: UNICIDAD DE LA FICHA ---
it('prevents creating a sheet with a duplicate number', function () {
    $admin = createUserAdminWithRole('Admin');
    
    // Creamos la ficha inicial
    Sheet_number::create(['number' => '111222']);

    // Intentamos duplicarla
    $response = $this->actingAs($admin)
        ->postJson('/api/sheets', ['number' => '111222']);

    // Debe saltar validación de Unicidad
    $response->assertStatus(422)
             ->assertJsonValidationErrors(['number']);
});

// --- TEST 4: ACTUALIZACIÓN DE FICHA ---
it('allows admin to edit an existing sheet number and state', function () {
    $admin = createUserAdminWithRole('Admin');
    $sheet = Sheet_number::create(['number' => '555555']);

    $response = $this->actingAs($admin)
        ->putJson("/api/sheets/{$sheet->id}", [
            'number' => '666666',
            'active' => true,
            'state' => 'terminada'
        ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('sheet_numbers', [
        'id' => $sheet->id,
        'number' => '666666',
        'active' => true,
        'state' => 'terminada'
    ]);
});

// --- TEST 5: ELIMINACIÓN DE FICHA ---
it('allows admin to successfully delete a sheet', function () {
    $admin = createUserAdminWithRole('Admin');
    $sheet = Sheet_number::create(['number' => '777777']);

    $response = $this->actingAs($admin)
        ->deleteJson("/api/sheets/{$sheet->id}");

    $response->assertStatus(200);
    $this->assertSoftDeleted('sheet_numbers', [
        'id' => $sheet->id
    ]);
});
