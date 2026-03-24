<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\actingAs;

beforeEach(function () {
    $roles = ['Admin', 'Instructor', 'Aprendiz', 'Dependencia'];
    foreach ($roles as $role) {
        Role::firstOrCreate(['name' => $role]);
    }

    $this->apprentice = User::firstOrCreate(
        ['email' => 'apprentice_profile@test.com'],
        ['name' => 'Apprentice Profile', 'password' => bcrypt('password123'), 'document_type' => 'CC', 'document_number' => '300000']
    );
    $this->apprentice->assignRole('Aprendiz');
});

test('apprentice can access allowed web routes (profile, dependencies)', function () {
    actingAs($this->apprentice)->get('/profile')->assertStatus(200);
    actingAs($this->apprentice)->get('/dependencies')->assertStatus(200);
});

test('apprentice CANNOT access forbidden web routes (management)', function () {
    
    actingAs($this->apprentice)->get('/users/instructor')->assertForbidden();
    actingAs($this->apprentice)->get('/users/aprendiz')->assertForbidden();
    actingAs($this->apprentice)->get('/sheets')->assertForbidden();
});

test('apprentice can update his own profile details', function () {
    $response = actingAs($this->apprentice)->patch('/profile', [
        'name' => 'New Apprentice Name',
        'email' => 'apprentice_new@test.com',
    ]);
    
    $response->assertSessionHasNoErrors();
    $response->assertRedirect('/profile');

    $this->assertDatabaseHas('users', [
        'id' => $this->apprentice->id,
        'name' => 'New Apprentice Name',
    ]);
});

test('apprentice CANNOT delete their own account', function () {
    
    $response = actingAs($this->apprentice)->delete('/profile', [
        'password' => 'password123'
    ]);

    $response->assertForbidden();

    $this->assertDatabaseHas('users', [
        'id' => $this->apprentice->id
    ]);
});
