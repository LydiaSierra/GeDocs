<?php

namespace Tests\Feature\Instructor;

use App\Models\User;
use App\Models\Sheet_number;
use App\Notifications\NewUserRegistered;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Database\Seeders\RoleSeeder;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

function createInstructorUserForNotification(string $role, array $attributes = [])
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

it('allows instructor to list notifications', function () {
    $instructor = createInstructorUserForNotification('Instructor');
    $aprendiz = createInstructorUserForNotification('Aprendiz', ['name' => 'Nuevo Aprendiz']);
    
    // Trigger notification
    $instructor->notify(new NewUserRegistered($aprendiz));

    $response = $this->actingAs($instructor)
        ->getJson('/api/notifications');

    $response->assertStatus(200);
    $response->assertJsonStructure([
        'success',
        'notifications' => [
            '*' => [
                'id',
                'type',
                'data' => [
                    'role',
                    'user' => [
                        'id',
                        'name',
                        'email'
                    ]
                ],
                'read_at',
                'created_at'
            ]
        ]
    ]);
    
    $notifications = $response->json('notifications');
    expect(count($notifications))->toBe(1);
    expect($notifications[0]['data']['user']['name'])->toBe('Nuevo Aprendiz');
});

it('allows instructor to filter unread and read notifications', function () {
    $instructor = createInstructorUserForNotification('Instructor');
    $aprendiz1 = createInstructorUserForNotification('Aprendiz', ['name' => 'Apr 1']);
    $aprendiz2 = createInstructorUserForNotification('Aprendiz', ['name' => 'Apr 2']);
    
    $instructor->notify(new NewUserRegistered($aprendiz1));
    $instructor->notify(new NewUserRegistered($aprendiz2));

    // Get unread
    $responseUnread = $this->actingAs($instructor->fresh())->getJson('/api/notifications/filter/unread');
    $responseUnread->assertStatus(200);
    expect(count($responseUnread->json('notifications')))->toBe(2);

    // Mark one as read
    $notificationId = $responseUnread->json('notifications.0.id');
    $responseMark = $this->actingAs($instructor->fresh())->postJson("/api/notifications/{$notificationId}/mark-as-read");
    $responseMark->assertStatus(200);

    // Get read
    $responseRead = $this->actingAs($instructor->fresh())->getJson('/api/notifications/filter/read');
    $responseRead->assertStatus(200);
    expect(count($responseRead->json('notifications')))->toBe(1);

    // Get unread again
    $responseUnreadRefresh = $this->actingAs($instructor->fresh())->getJson('/api/notifications/filter/unread');
    $responseUnreadRefresh->assertStatus(200);
    expect(count($responseUnreadRefresh->json('notifications')))->toBe(1);
});

it('allows instructor to update apprentice status via notification', function () {
    $instructor = createInstructorUserForNotification('Instructor');
    $aprendiz = createInstructorUserForNotification('Aprendiz', ['name' => 'Pending Aprendiz']);
    
    $instructor->notify(new NewUserRegistered($aprendiz));
    
    $notification = $instructor->notifications()->first();

    // Accept user
    $response = $this->actingAs($instructor)
        ->putJson("/api/notifications/update/{$notification->id}/active");

    $response->assertStatus(200);
    $response->assertJsonFragment(['success' => true]);

    // Check DB for User status update
    $this->assertDatabaseHas('users', [
        'id' => $aprendiz->id,
        'status' => 'active'
    ]);

    // Check notification data update
    $updatedNotification = $instructor->notifications()->first();
    expect($updatedNotification->data['user']['status'])->toBe('active');
});

it('rejects an invalid state change for an apprentice via notification', function () {
    $instructor = createInstructorUserForNotification('Instructor');
    $aprendiz = createInstructorUserForNotification('Aprendiz', ['name' => 'Pending Aprendiz']);
    
    $instructor->notify(new NewUserRegistered($aprendiz));
    $notification = $instructor->notifications()->first();

    // Invalid state
    $response = $this->actingAs($instructor)
        ->putJson("/api/notifications/update/{$notification->id}/invalid-status");

    $response->assertStatus(400);
    $response->assertJsonFragment(['message' => 'Estado no permitido']);

    $this->assertDatabaseHas('users', [
        'id' => $aprendiz->id,
        'status' => 'pending' // Still pending
    ]);
});
