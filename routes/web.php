<?php

use App\Http\Controllers\ExplorerController;
use App\Http\Controllers\PdfController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware('auth')->group(function () {
  
// routes/web.php
Route::post('/generate-pdf', [PdfController::class, 'generate'])->name('pdf.generate');


    // Inbox principal
    Route::get('/', fn() => Inertia::render('Inbox'))
        ->name('inbox');

    //Vista de notificaciones pasando el id
    Route::get('/notifications', fn() => Inertia::render('Notifications', [
        'notificationId' => null
    ])
    )->name('notifications.index');

    // Gestion de Instructor
    Route::get('/users/instructor', fn() => Inertia::render('Users')
    )->name('instructor');

    // Gestion de Aprendices
    Route::get('/users/aprendiz', fn() => Inertia::render('Users')
    )->name('aprendiz');


    

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




require __DIR__ . '/auth.php';
