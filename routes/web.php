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
    Route::get('/notifications', fn() => Inertia::render('Notifications', [
        'notificationId' => null
    ])
    )->name('notifications.index');

    //Vista de una sola notificacion pasando el id
    Route::get('/notifications/{id}', fn($id) => Inertia::render('Notifications', [
        'notificationId' => $id
    ])
    )->name('notifications.show');

    Route::get('/explorer', [ExplorerController::class, 'index'])
        ->name('explorer');

    Route::get('/archive', fn() => Inertia::render('Archive'))
        ->name('archive');
    
    //Direccion a Formulario
    Route::get('/form', fn() => Inertia::render('Form'))
        ->name('form');

    //Vistas de Fichas
    Route::get('/sheets', fn() => Inertia::render('Sheets'))
        ->name('sheets');

    //Vistas Dependencias
    Route::get('/dependencies', fn() => Inertia::render('Dependencies'))
        ->name('dependencies');
    
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
