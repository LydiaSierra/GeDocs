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

test('instructor CANNOT access forbidden web routes (instructor management)', function () {

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
