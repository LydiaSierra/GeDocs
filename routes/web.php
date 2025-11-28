<?php

use App\Http\Controllers\ExplorerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware('auth')->group(function () {
    // --------- NOTIFICATIONS ---------
    Route::get('/api/notifications', [NotificationController::class, 'index']);
    Route::get('/api/notifications/{id}', [NotificationController::class, 'show']);
    Route::get('/api/notifications/filter/unread', [NotificationController::class, 'unread']);
    Route::get('/api/notifications/filter/read', [NotificationController::class, 'read']);
    Route::post('/api/notifications/{id}/mark-as-read   ', [NotificationController::class, 'markAsRead']);

    // --------- NOTIFICATIONS ---------
    Route::get('/api/notifications', [NotificationController::class, 'index']);
    Route::get('/api/notifications/{id}', [NotificationController::class, 'show']);
    Route::get('/api/notifications/filter/unread', [NotificationController::class, 'unread']);
    Route::get('/api/notifications/filter/read', [NotificationController::class, 'read']);
    Route::post('/api/notifications/{id}/mark-as-read   ', [NotificationController::class, 'markAsRead']);

    // Inbox principal
    Route::get('/', fn() => Inertia::render('Inbox'))
        ->name('inbox');

    //Vista de notificaciones pasando el id
    Route::get('/notifications', fn() => Inertia::render('Notifications', [
        'notificationId' => null
    ])
    )->name('notifications.index');

    // Gestion de Usuarios
    Route::get('/users/instructor', fn() => Inertia::render('Users')
    )->name('users');

    //Vista de una sola notificacion pasando el id
    Route::get('/notifications/{id}', fn($id) => Inertia::render('Notifications', [
        'notificationId' => $id
    ])
    )->name('notifications.show');

    Route::get('/explorer', [ExplorerController::class, 'index'])
        ->name('explorer');

    Route::get('/archive', fn() => Inertia::render('Archive'))
        ->name('archive');

    // Vistas de perfil
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});


Route::post('/upload', [FileController::class, 'store'])
    ->name('files.store');

require __DIR__ . '/auth.php';