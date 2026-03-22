<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\actingAs;

beforeEach(function () {
    $roles = ['Admin', 'Instructor', 'Aprendiz', 'Dependencia'];
    foreach ($roles as $role) {
        Role::firstOrCreate(['name' => $role]);
    }

    $this->instructor = User::firstOrCreate(
        ['email' => 'instructor_profile@test.com'],
        ['name' => 'Instructor Profile', 'password' => bcrypt('password123'), 'document_type' => 'CC', 'document_number' => '200000']
    );
    $this->instructor->assignRole('Instructor');
});

test('instructor can access allowed web routes (aprendices, sheets, dependencies)', function () {
    actingAs($this->instructor)->get('/users/aprendiz')->assertStatus(200);
    actingAs($this->instructor)->get('/sheets')->assertStatus(200);
    actingAs($this->instructor)->get('/dependencies')->assertStatus(200);
});

test('instructor CANNOT access forbidden web routes (instructor management)', function () {
    // Should be forbidden (403), NOT 200. This is testing the REQUIRED safe behavior.
    $response = actingAs($this->instructor)->get('/users/instructor');
    $response->assertForbidden(); 
});

test('instructor can update his own profile details', function () {
    $response = actingAs($this->instructor)->patch('/profile', [
        'name' => 'New Instructor Name',
        'email' => 'instructor_new@test.com',
    ]);
    
    $response->assertSessionHasNoErrors();
    $response->assertRedirect('/profile');

    $this->assertDatabaseHas('users', [
        'id' => $this->instructor->id,
        'name' => 'New Instructor Name',
    ]);
});

test('instructor CANNOT delete their own account', function () {
    // Should be forbidden (403), NOT 302 to /. This is testing the REQUIRED safe behavior.
    $response = actingAs($this->instructor)->delete('/profile', [
        'password' => 'password123'
    ]);

    $response->assertForbidden();

    $this->assertDatabaseHas('users', [
        'id' => $this->instructor->id
    ]);
});
