<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Notifications\NewUserRegistered;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Database\Seeders\RoleSeeder;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RoleSeeder::class);
});

function createAdminUserForNotification(string $role, array $attributes = [])
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

it('allows admin to list notifications', function () {
    $admin = createAdminUserForNotification('Admin');
    $instructor = createAdminUserForNotification('Instructor', ['name' => 'Nuevo Instructor']);
    
    // Trigger notification
    $admin->notify(new NewUserRegistered($instructor));

    $response = $this->actingAs($admin)
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
    expect($notifications[0]['data']['user']['name'])->toBe('Nuevo Instructor');
});

it('allows admin to filter unread and read notifications', function () {
    $admin = createAdminUserForNotification('Admin');
    $instructor1 = createAdminUserForNotification('Instructor', ['name' => 'Inst 1']);
    $instructor2 = createAdminUserForNotification('Instructor', ['name' => 'Inst 2']);
    
    $admin->notify(new NewUserRegistered($instructor1));
    $admin->notify(new NewUserRegistered($instructor2));

    // Get unread
    $responseUnread = $this->actingAs($admin->fresh())->getJson('/api/notifications/filter/unread');
    $responseUnread->assertStatus(200);
    expect(count($responseUnread->json('notifications')))->toBe(2);

    // Mark one as read
    $notificationId = $responseUnread->json('notifications.0.id');
    $responseMark = $this->actingAs($admin->fresh())->postJson("/api/notifications/{$notificationId}/mark-as-read");
    $responseMark->assertStatus(200);

    // Get read
    $responseRead = $this->actingAs($admin->fresh())->getJson('/api/notifications/filter/read');
    $responseRead->assertStatus(200);
    expect(count($responseRead->json('notifications')))->toBe(1);

    // Get unread again
    $responseUnreadRefresh = $this->actingAs($admin->fresh())->getJson('/api/notifications/filter/unread');
    $responseUnreadRefresh->assertStatus(200);
    expect(count($responseUnreadRefresh->json('notifications')))->toBe(1);
});

it('allows admin to update user status via notification', function () {
    $admin = createAdminUserForNotification('Admin');
    $instructor = createAdminUserForNotification('Instructor', ['name' => 'Pending Instructor']);
    
    $admin->notify(new NewUserRegistered($instructor));
    
    $notification = $admin->notifications()->first();

    // Accept user
    $response = $this->actingAs($admin)
        ->putJson("/api/notifications/update/{$notification->id}/active");

    $response->assertStatus(200);
    $response->assertJsonFragment(['success' => true]);

    // Check DB for User status update
    $this->assertDatabaseHas('users', [
        'id' => $instructor->id,
        'status' => 'active'
    ]);

    // Check notification data update
    $updatedNotification = $admin->notifications()->first();
    expect($updatedNotification->data['user']['status'])->toBe('active');
});

it('rejects an invalid state change for a user via notification', function () {
    $admin = createAdminUserForNotification('Admin');
    $instructor = createAdminUserForNotification('Instructor', ['name' => 'Pending Instructor']);
    
    $admin->notify(new NewUserRegistered($instructor));
    $notification = $admin->notifications()->first();

    // Invalid state
    $response = $this->actingAs($admin)
        ->putJson("/api/notifications/update/{$notification->id}/invalid-status");

    $response->assertStatus(400);
    $response->assertJsonFragment(['message' => 'Estado no permitido']);

    $this->assertDatabaseHas('users', [
        'id' => $instructor->id,
        'status' => 'pending' // Still pending
    ]);
});
