<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Models\Sheet_number;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Database\Seeders\RoleSeeder;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

function createAdminUserWithRole(string $role, array $attributes = [])
{
    $defaultAttributes = [
        'type_document' => 'CC',
        'document_number' => (string)rand(10000000, 99999999),
        'status' => 'pending'
    ];

    $user = User::factory()->create(array_merge($defaultAttributes, $attributes));
    $user->assignRole($role);
    return $user;
}

it('allows admin to list instructors', function () {
    $admin = createAdminUserWithRole('Admin');
    $instructor1 = createAdminUserWithRole('Instructor', ['name' => 'El Profe']);
    $instructor2 = createAdminUserWithRole('Instructor', ['name' => 'La Profe']);

    $response = $this->actingAs($admin)
        ->getJson('/api/users');

    $response->assertStatus(200);
    $response->assertJsonFragment(['name' => 'El Profe']);
    $response->assertJsonFragment(['name' => 'La Profe']);
});
it('allows admin to edit instructor and assign sheet numbers', function () {
    $admin = createAdminUserWithRole('Admin');
    $instructor = createAdminUserWithRole('Instructor');

    $sheet1 = Sheet_number::create(['number' => '1001001']);
    $sheet2 = Sheet_number::create(['number' => '2002002']);

    $payload = [
        'name' => 'Instructor Editado',
        'type_document' => 'CC',
        'document_number' => '12345678',
        'email' => 'nuevo_inst@sena.edu.co',
        'status' => 'active',

        'sheet_numbers' => [$sheet1->id, $sheet2->id]
    ];

    $response = $this->actingAs($admin)
        ->putJson("/api/users/{$instructor->id}", $payload);

    $response->assertStatus(200);

    $this->assertDatabaseHas('users', [
        'id' => $instructor->id,
        'name' => 'Instructor Editado',
        'status' => 'active',
    ]);

    $this->assertDatabaseHas('sheet_number_user', [
        'user_id' => $instructor->id,
        'sheet_number_id' => $sheet1->id
    ]);

    $this->assertDatabaseHas('sheet_number_user', [
        'user_id' => $instructor->id,
        'sheet_number_id' => $sheet2->id
    ]);
});

it('allows admin to delete an instructor', function () {
    $admin = createAdminUserWithRole('Admin');
    $instructor = createAdminUserWithRole('Instructor');

    $response = $this->actingAs($admin)
        ->deleteJson("/api/users/{$instructor->id}");

    $response->assertStatus(200);
    $this->assertDatabaseMissing('users', ['id' => $instructor->id]);
});
