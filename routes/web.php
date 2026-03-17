<?php

use App\Http\Controllers\ExplorerController;
use App\Http\Controllers\FolderController;
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
    Route::get(
        '/notifications',
        fn() => Inertia::render('Notifications', [
            'notificationId' => null
        ])
    )->name('notifications.index');

    //Gestion Admin General

    // Gestion de Aprendices
    Route::get(
        '/users/aprendiz',
        fn() => Inertia::render('Users')
    )->name('aprendiz');

    //Vista de notificaciones de los aprendices
    Route::get(
        '/notifications/aprendiz',
        fn() => Inertia::render('Notifications', [
            'notificationId' => null
        ])
    )->name('notifications.aprendiz');

    //Gestion Admin General

    // Gestion de Instructor
    Route::get(
        '/users/instructor',
        fn() => Inertia::render('Users')
    )->name('instructor');

    //Vista de una sola notificacion pasando el id
    Route::get(
        '/notifications/{id}',
        fn($id) => Inertia::render('Notifications', [
            'notificationId' => $id
        ])
    )->name('notifications.show');


    //VISTA DE EXPLORADOR
    Route::get('/explorer', [FolderController::class, 'explorer'])
        ->name('explorer');

    Route::post('/folders', [FolderController::class, 'store'])
        ->name('folders.store');

    Route::post('/folders/{folder}/upload', [FolderController::class, 'upload'])
        ->name('folders.upload');

    Route::put('/folders/{folderId}', [FolderController::class, 'updateFolder'])
        ->name('folders.update');

    Route::get('/folders/file/download/{file}', [FolderController::class, 'download'])
        ->name('folders.download');

    Route::post('/folders/delete-mixed', [FolderController::class, 'deleteMixed'])
        ->name('folders.deleteMixed');

    Route::post('/folders/download-mixed-zip', [FolderController::class, 'downloadMixedZip'])
        ->name('folders.downloadMixedZip');

    Route::get('/folders/archived', [FolderController::class, 'archived'])
        ->name('folders.archived');

    Route::post('/folders/restore-mixed', [FolderController::class, 'restoreMixed'])
        ->name('folders.restoreMixed');

    Route::get('/archive', fn() => Inertia::render('Archive'))
        ->name('archive');

    //Direccion a Formulario
    Route::get('/form', function () {
        $dependencies = \App\Models\Dependency::select('id', 'name')->get();
        return Inertia::render('Form', [
            'dependencies' => $dependencies,
        ]);

    })->name('form');

    //Vistas de Fichas
    Route::get('/sheets', fn() => Inertia::render('Sheets'))
        ->name('sheets')->middleware("roleCheck");

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

    //Vistas indice Electronico
    Route::get('/electronic-index', fn() => Inertia::render('ElectronicIndex'))
        ->name('electronic-index');
});




require __DIR__ . '/auth.php';
