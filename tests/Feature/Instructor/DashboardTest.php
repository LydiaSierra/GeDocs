<?php

use App\Models\User;
use App\Models\PQR;
use App\Models\Dependency;
use App\Models\Sheet_number;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\actingAs;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'Instructor']);

    $this->sheetAssigned = Sheet_number::create([
        'number' => '123456',
        'active' => 1,
        'state' => 'active'
    ]);

    $this->sheetNotAssigned = Sheet_number::create([
        'number' => '654321',
        'active' => 1,
        'state' => 'active'
    ]);

    $this->dependency = Dependency::create([
        'name' => 'Instructor Area',
        'sheet_number_id' => $this->sheetAssigned->id
    ]);

    $this->instructor = User::firstOrCreate(
        ['email' => 'instructor@test.com'],
        ['name' => 'Instructor Test', 'password' => bcrypt('password123'), 'document_type' => 'CC', 'document_number' => '222']
    );
    $this->instructor->assignRole('Instructor');
    $this->instructor->sheetNumbers()->attach($this->sheetAssigned->id);

    // PQR associated with assigned sheet
    $this->pqrAssigned = PQR::create([
        'sender_name' => 'Sender 1',
        'description' => 'Test PQR assigned',
        'affair' => 'Test Affair',
        'request_type' => 'Peticion',
        'state' => false,
        'archived' => false,
        'user_id' => $this->instructor->id,
        'dependency_id' => $this->dependency->id,
        'sheet_number_id' => $this->sheetAssigned->id,
        'response_status' => 'pending',
        'document_type' => 'CC',
        'document' => '555'
    ]);

    // PQR associated with unassigned sheet
    $this->pqrNotAssigned = PQR::create([
        'sender_name' => 'Sender 2',
        'description' => 'Test PQR not assigned',
        'affair' => 'Test Affair',
        'request_type' => 'Peticion',
        'state' => false,
        'archived' => false,
        'user_id' => $this->instructor->id,
        'dependency_id' => $this->dependency->id,
        'sheet_number_id' => $this->sheetNotAssigned->id,
        'response_status' => 'pending',
        'document_type' => 'CC',
        'document' => '333'
    ]);
});

test('Instructor can list ONLY assigned PQRS using sheetShow endpoint', function () {
    $response = actingAs($this->instructor)->getJson('/api/pqrs/instructor');
    $response->assertStatus(200);
    
    $data = collect($response->json());
    expect($data->pluck('id'))->toContain($this->pqrAssigned->id);
    expect($data->pluck('id'))->not->toContain($this->pqrNotAssigned->id);
});

test('Instructor can list ONLY assigned PQRS from the main index filtering', function () {
    $response = actingAs($this->instructor)->getJson('/api/pqrs');
    $response->assertStatus(200);
    
    $data = collect($response->json('data'));
    expect($data->pluck('id'))->toContain($this->pqrAssigned->id);
    expect($data->pluck('id'))->not->toContain($this->pqrNotAssigned->id);
});