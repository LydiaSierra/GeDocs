<?php

use App\Models\User;
use App\Models\Dependency;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

function createUserWithRole(string $role, array $extra = [])
{
    $user = User::factory()->create(array_merge([
        'type_document' => 'CC',
        'document_number' => (string)rand(10000000, 99999999),
        'status' => 'active',
    ], $extra));
    $user->assignRole($role);
    return $user;
}

it('denies access to apprentice users for user management routes', function () {
    $apprentice = createUserWithRole('Aprendiz');

    $this->actingAs($apprentice)
        ->getJson('/api/users')
        ->assertForbidden(); 
});

it('lists users according to role permissions', function (string $role) {

    $sheet = \App\Models\Sheet_number::create(['number' => (string)rand(10000, 99999)]);
    $dependency = Dependency::create(['name' => 'IT Department', 'sheet_number_id' => $sheet->id]);

    $authUser = createUserWithRole($role);

    $apprentice = createUserWithRole('Aprendiz');

    $authUser->sheetNumbers()->attach($sheet->id);
    $apprentice->sheetNumbers()->attach($sheet->id);

    $otherAdmin = createUserWithRole('Admin');

    $response = $this->actingAs($authUser)->getJson('/api/users');

    $response->assertStatus(200);

    if ($role === 'Admin') {
        
        $response->assertJsonFragment(['email' => $apprentice->email]);
        $response->assertJsonFragment(['email' => $otherAdmin->email]);
    }
    else {
        
        $response->assertJsonFragment(['email' => $apprentice->email]);
        $response->assertJsonMissing(['email' => $otherAdmin->email]);
    }
})->with(['Admin', 'Instructor']);

it('shows detailed info of a user', function (string $role) {
    $authUser = createUserWithRole($role);
    $apprentice = createUserWithRole('Aprendiz');

    $response = $this->actingAs($authUser)
        ->getJson("/api/users/{$apprentice->id}");

    $response->assertStatus(200)
        ->assertJsonFragment(['email' => $apprentice->email]);
})->with(['Admin', 'Instructor']);

it('filters users correctly', function (string $role) {
    $authUser = createUserWithRole($role);

    $targetUser = createUserWithRole('Aprendiz', ['name' => 'John Doe Filter']);

    createUserWithRole('Aprendiz', ['name' => 'Jane Smith']); 

    $response = $this->actingAs($authUser)
        ->getJson('/api/users/search/filter?name=Doe');

    $response->assertStatus(200)
        ->assertJsonFragment(['name' => 'John Doe Filter'])
        ->assertJsonMissing(['name' => 'Jane Smith']);
})->with(['Admin', 'Instructor']);

it('edits an apprentice profile successfully', function (string $role) {
    $authUser = createUserWithRole($role);

    $apprentice = createUserWithRole('Aprendiz', ['name' => 'Old Name']);

    $response = $this->actingAs($authUser)
        ->putJson("/api/users/{$apprentice->id}", [
        'name' => 'New Name Edited',
    ]);

    $response->assertStatus(200);
    $this->assertDatabaseHas('users', ['id' => $apprentice->id, 'name' => 'New Name Edited']);
})->with(['Admin', 'Instructor']);

it('prevents instructor from editing an admin user', function () {
    $instructor = createUserWithRole('Instructor');
    $admin = createUserWithRole('Admin', ['name' => 'Super Admin']);

    $response = $this->actingAs($instructor)
        ->putJson("/api/users/{$admin->id}", [
        'name' => 'Hacked Admin',
    ]);

    $response->assertStatus(302);
    $this->assertDatabaseHas('users', ['id' => $admin->id, 'name' => 'Super Admin']);
});

it('allows deleting an apprentice', function (string $role) {
    $authUser = createUserWithRole($role);

    $apprentice = createUserWithRole('Aprendiz');

    $response = $this->actingAs($authUser)
        ->deleteJson("/api/users/{$apprentice->id}");

    $response->assertStatus(200);
    $this->assertDatabaseMissing('users', ['id' => $apprentice->id]);
})->with(['Admin', 'Instructor']);
?>