<?php

use App\Models\User;
use App\Models\PQR;
use App\Models\Dependency;
use App\Models\Sheet_number;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\actingAs;

beforeEach(function () {
    // Configuración de Roles
    $roles = ['Admin', 'Instructor', 'Aprendiz', 'Dependencia'];
    foreach ($roles as $role) {
        Role::firstOrCreate(['name' => $role]);
    }

    // Ficha y Dependencia común
    $this->sheet = Sheet_number::create([
        'number' => '123456',
        'start_date' => now()->subMonths(6),
        'end_date' => now()->addMonths(6),
        'state' => 'Activa',
        'ventanilla_unica_id' => 1 // Placeholder
    ]);

    $this->dependency = Dependency::create([
        'name' => 'Ventanilla Unica Test Administrador',
        'sheet_number_id' => $this->sheet->id
    ]);
    
    $this->sheet->update(['ventanilla_unica_id' => $this->dependency->id]);

    // Admin User
    $this->admin = User::firstOrCreate(
        ['email' => 'admin_sent@test.com'],
        ['name' => 'Admin Sent Test', 'password' => bcrypt('password123'), 'document_type' => 'CC', 'document_number' => '111222']
    );
    $this->admin->assignRole('Admin');

    // Mocks de PQRs "Respondidos" (Archived = true)
    $this->archivedPqr = PQR::create([
        'sender_name' => 'Admin Test Sender',
        'description' => 'Test PQR admin view - ARCHIVED',
        'affair' => 'Test Affair Responded',
        'request_type' => 'Peticion',
        'state' => true,
        'archived' => true, // <-- CRÍTICO PARA EL MÓDULO ENVIADOS
        'user_id' => $this->admin->id,
        'dependency_id' => $this->dependency->id,
        'sheet_number_id' => $this->sheet->id,
        'response_status' => 'responded',
        'document_type' => 'CC',
        'document' => '555'
    ]);

    // Mocks de PQRs "No Respondidos" (Archived = false) para verificar que NO se filtren aquí
    $this->pendingPqr = PQR::create([
        'sender_name' => 'Pending Sender',
        'description' => 'Test PQR admin view - PENDING',
        'affair' => 'Test Affair Pending',
        'request_type' => 'Queja',
        'state' => false,
        'archived' => false, // <-- ESTO NO DEBERÍA APARECER
        'user_id' => $this->admin->id,
        'dependency_id' => $this->dependency->id,
        'sheet_number_id' => $this->sheet->id,
        'response_status' => 'pending',
        'document_type' => 'CC',
        'document' => '555'
    ]);
});

test('Admin can list only responded (archived) PQRS via sent module endpoint', function () {
    // El frontend pide ?archived=true para el buzón de enviados/archivados
    $response = actingAs($this->admin)->getJson('/api/pqrs?archived=true');
    
    $response->assertStatus(200);
    $response->assertJsonStructure([
        'data' => [
            '*' => ['id', 'sender_name', 'description']
        ],
        'message'
    ]);
    
    $data = collect($response->json('data'));
    
    // Debería contener el PQRS respondido
    expect($data->pluck('id'))->toContain($this->archivedPqr->id);
    
    // NO debería contener el PQRS pendiente (Dashboard)
    expect($data->pluck('id'))->not->toContain($this->pendingPqr->id);
    
    expect($response->json('message'))->toBe('PQRs archivadas obtenidas exitosamente');
});
