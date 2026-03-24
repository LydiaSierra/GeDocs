<?php

use App\Models\User;
use App\Models\PQR;
use App\Models\Dependency;
use App\Models\Sheet_number;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\actingAs;

beforeEach(function () {
    
    $roles = ['Aprendiz'];
    foreach ($roles as $role) {
        Role::firstOrCreate(['name' => $role]);
    }

    $this->sheet = Sheet_number::create([
        'number' => '123456',
        'start_date' => now()->subMonths(6),
        'end_date' => now()->addMonths(6),
        'state' => 'Activa',
        'ventanilla_unica_id' => 1
    ]);

    $this->dependency = Dependency::create([
        'name' => 'Ventanilla Unica Test Aprendiz',
        'sheet_number_id' => $this->sheet->id
    ]);
    
    $this->sheet->update(['ventanilla_unica_id' => $this->dependency->id]);

    $this->apprentice = User::firstOrCreate(
        ['email' => 'aprendiz_sent@test.com'],
        ['name' => 'Aprendiz Sent Test', 'password' => bcrypt('password123'), 'document_type' => 'CC', 'document_number' => '333444', 'dependency_id' => $this->dependency->id]
    );
    $this->apprentice->assignRole('Aprendiz');

    $this->archivedOwnDependencyPqr = PQR::create([
        'sender_name' => 'Own Dependency Sender',
        'description' => 'Test PQR Apprentice - ARCHIVED OWN DEP',
        'affair' => 'Test Affair',
        'request_type' => 'Peticion',
        'state' => true,
        'archived' => true, 
        'user_id' => $this->apprentice->id,
        'dependency_id' => $this->dependency->id,
        'sheet_number_id' => $this->sheet->id,
        'response_status' => 'responded',
        'document_type' => 'CC',
        'document' => '555'
    ]);
});

test('Apprentice only sees archived PQRs of their own dependency via sent module', function () {
    $response = actingAs($this->apprentice)->getJson('/api/pqrs?archived=true');
    $response->assertStatus(200);
    
    $data = collect($response->json('data'));

    expect($data->pluck('id'))->toContain($this->archivedOwnDependencyPqr->id);
});

test('Apprentice does not see archived PQRs from other dependencies', function () {
    
    $otherDependency = Dependency::create([
        'name' => 'Otra Dependencia Aleatoria',
        'sheet_number_id' => $this->sheet->id 
    ]);

    $archivedOtherDependencyPqr = PQR::create([
        'sender_name' => 'Other Dependency Sender',
        'description' => 'Test PQR Apprentice - ARCHIVED OTHER DEP',
        'affair' => 'Test Affair',
        'request_type' => 'Peticion',
        'state' => true,
        'archived' => true, 
        'user_id' => 1,
        'dependency_id' => $otherDependency->id,
        'sheet_number_id' => $this->sheet->id,
        'response_status' => 'responded',
        'document_type' => 'CC',
        'document' => '777'
    ]);

    $response = actingAs($this->apprentice)->getJson('/api/pqrs?archived=true');
    $response->assertStatus(200);
    
    $data = collect($response->json('data'));

    expect($data->pluck('id'))->not->toContain($archivedOtherDependencyPqr->id);
});
