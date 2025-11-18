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

    // Inbox principal
    Route::get('/', fn() => Inertia::render('Inbox'))
        ->name('inbox');

    //Vista de notificaciones pasando el id
    Route::get('/notifications', fn() =>
    Inertia::render('Notifications', [
        'notificationId' => null
    ])
    )->name('notifications.index');

    //Vista de una sola notificacion pasando el id
    Route::get('/notifications/{id}', fn($id) =>
    Inertia::render('Notifications', [
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





Route::prefix('api')->group(function () {

    // Folders
    Route::get('/folders/parent_id/{id}', [FolderController::class, 'getByParent'])
        ->name('api.folders.byParent');

    Route::get('/allFolders', [FolderController::class, 'getAllFolders'])
        ->name('api.folders.all');

    Route::get('/folders', [FolderController::class, "index"])
        ->name('api.folders');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('api.notifications.index');

    Route::get('/notifications/{id}', [NotificationController::class, 'show'])
        ->name('api.notifications.show');

    Route::get('/notifications/unread', [NotificationController::class, 'unread'])
        ->name('api.notifications.unread');
    Route::get('/notifications/read', [NotificationController::class, 'read'])
        ->name('api.notifications.read');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])
        ->name('api.notifications.markAsRead');


});

Route::post('/upload', [FileController::class, 'store'])
    ->name('files.store');

require __DIR__ . '/auth.php';
