<?php

use App\Models\User;
use App\Models\PQR;
use App\Models\Dependency;
use App\Models\Sheet_number;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\actingAs;

beforeEach(function () {
    $roles = ['Admin', 'Instructor', 'Aprendiz', 'Dependencia'];
    foreach ($roles as $role) {
        Role::firstOrCreate(['name' => $role]);
    }

    $this->sheet1 = Sheet_number::create([
        'number' => '111111',
        'start_date' => now()->subMonths(6),
        'end_date' => now()->addMonths(6),
        'state' => 'Activa',
        'ventanilla_unica_id' => 1
    ]);

    $this->sheet2 = Sheet_number::create([
        'number' => '222222',
        'start_date' => now()->subMonths(6),
        'end_date' => now()->addMonths(6),
        'state' => 'Activa',
        'ventanilla_unica_id' => 1
    ]);

    $this->dependency = Dependency::create([
        'name' => 'Dep Test',
        'sheet_number_id' => $this->sheet1->id
    ]);

    $this->instructor = User::firstOrCreate(
        ['email' => 'instructor_archive@test.com'],
        ['name' => 'Instructor Archive', 'password' => bcrypt('password123'), 'document_type' => 'CC', 'document_number' => '888888']
    );
    $this->instructor->assignRole('Instructor');

    // Assign instructor to sheet1 ONLY
    $this->instructor->sheetNumbers()->attach($this->sheet1->id);

    // Archived PQR belonging to assigned sheet
    $this->archivedPqrAssigned = PQR::create([
        'sender_name' => 'Assigned Sender',
        'description' => 'Belongs to assigned sheet',
        'affair' => 'Assigned',
        'request_type' => 'Peticion',
        'state' => true,
        'archived' => true,
        'user_id' => $this->instructor->id,
        'dependency_id' => $this->dependency->id,
        'sheet_number_id' => $this->sheet1->id,
        'response_status' => 'responded',
        'document_type' => 'CC',
        'document' => '111'
    ]);

    // Archived PQR belonging to another sheet
    $this->archivedPqrUnassigned = PQR::create([
        'sender_name' => 'Unassigned Sender',
        'description' => 'Does not belong to assigned sheet',
        'affair' => 'Unassigned',
        'request_type' => 'Peticion',
        'state' => true,
        'archived' => true,
        'user_id' => $this->instructor->id,
        'dependency_id' => $this->dependency->id,
        'sheet_number_id' => $this->sheet2->id,
        'response_status' => 'responded',
        'document_type' => 'CC',
        'document' => '222'
    ]);
});

test('Instructor can only list archived PQRS of their assigned sheets', function () {
    $response = actingAs($this->instructor)->getJson('/api/pqrs?archived=true');
    
    $response->assertStatus(200);
    
    $data = collect($response->json('data'));
    
    // Should see PQR of assigned sheet
    expect($data->pluck('id'))->toContain($this->archivedPqrAssigned->id);
    
    // Should NOT see PQR of unassigned sheet
    expect($data->pluck('id'))->not->toContain($this->archivedPqrUnassigned->id);
});
