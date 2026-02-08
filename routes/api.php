<?php

use App\Http\Controllers\Api\CommunicationController;
use App\Http\Controllers\Api\PQRController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DependencyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SheetController;
use App\Http\Controllers\SheetUserController;

Route::middleware('auth:sanctum')->group(function () {

    // --------- FOLDERS ---------
    // Get the contents (subfolders and files) of a specific folder
    Route::get('/folders/parent_id/{id}', [FolderController::class, 'show']);

    // Get all root-level folders (no parent)
    Route::get('/folders', [FolderController::class, 'index']);

    // Global search for folders and files
    Route::get('/search', [FolderController::class, 'globalSearch']);


    // Get all folders in the system (used for selectors or trees)
    Route::get('/folders-all', [FolderController::class, 'getAllFolders']);

    // Upload one or more files to a specific folder
    Route::post("/folders/{id}/upload", [FolderController::class, "upload"]);

    // Delete a single file by its ID
    Route::delete('/folders/file/{fileId}', [FolderController::class, 'destroyFile']);


    // --------- NOTIFICATIONS ---------
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/{id}', [NotificationController::class, 'show']);
    Route::get('/notifications/filter/unread', [NotificationController::class, 'unread']);
    Route::get('/notifications/filter/read', [NotificationController::class, 'read']);
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::put("/notifications/update/{idNotification}/{state}", [NotificationController::class, 'updateUserOfNotification']);

    // ============= USERS API (Admin e Instructor) ==============
    Route::middleware('role:Admin|Instructor')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::get('/users/search/filter', [UserController::class, 'userByFilter']);

        // ================== FOLDERS ROUTES ==================
        // Creates a new folder
        Route::post("/folders", [FolderController::class, "store"]);

        // Logically deletes (moves to trash) a mixed selection of folders and files.
        Route::post('/folders/delete-mixed', [FolderController::class, 'deleteMixed']);

        //  Updates an existing folder.
        Route::put('/folders/{folderId}', [FolderController::class, 'updateFolder']);

        //   Downloads a single file.
        Route::get('/folders/file/download/{id}', [FolderController::class, 'download']);

        //  Downloads multiple folders and/or files as a ZIP archive.p
        Route::post('/folders/download-mixed-zip', [FolderController::class, 'downloadMixedZip']);

        //   Deletes multiple folders or files at once.
        Route::post('/folders/delete-multiple', [FolderController::class, 'deleteMultiple']);




        // ============= SHEETS ==============
        Route::post('/sheets/add/user/{numberSheet}/{idUser}', [SheetController::class, 'addUserFromSheet']);
        Route::get('/sheets', [SheetController::class, 'index']);
        Route::get("/sheets/{id}", [SheetController::class, 'show']);
        Route::post('/dependency', [DependencyController::class, 'store']);
        Route::get('/dependency', [DependencyController::class, 'index']);
        Route::get('/dependency/{id}', [DependencyController::class, 'show']);
        Route::put('/dependency/{id}', [DependencyController::class, 'update']);
        Route::delete('/dependency/{id}', [DependencyController::class, 'destroy']);

        //Get sheets related with specific user
        Route::get("/sheetsNumber", [SheetUserController::class, 'index']);
    });

    // ONLY ADMIN
    Route::middleware('role:Admin')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);


        // ============= SHEETS ==============
        Route::post('/sheets', [SheetController::class, 'store']);
        Route::put('/sheets/{id}', [SheetController::class, 'update']);
        Route::delete('/sheets/{id}', [SheetController::class, 'destroy']);
        Route::delete('/sheets/delete/user/{numberSheet}/{idUser}', [SheetController::class, 'deleteUserFromSheet']);
    });

    // ============= PQRS ==============
    Route::post('pqrs/{id}/respond', [PQRController::class, 'respond']);

    // USER AUTH INFO
    Route::get('/me', function (Request $request) {
        return response()->json([
            'user' => $request->user()->load('roles')
        ]);
    });

    // LOGOUT
    Route::post('/logout', function (Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logout exitoso']);
    });

    Route::patch('pqrs/{id}', [PQRController::class, 'update']);

    //Listar PQRS INSTRUCTOR
    Route::get('pqrs/instructor', [PQRController::class, 'sheetShow']);

    // Listar todas las PQRs
    Route::get('/pqrs', [PQRController::class, 'index']);

    // ----------- Editprofile -------------

    // Edit the profile photo
    Route::post('/profile/photo', [ProfileController::class, 'updateProfilePhoto']);
});

// ----------- CREAR PQRS -------------


// Crear una nueva PQR
Route::post('pqrs', [PQRController::class, 'store']);

// Mostrar una PQR específica
Route::get('pqrs/{id}', [PQRController::class, 'show']);

// Actualizar una PQR
Route::put('pqrs/{id}', [PQRController::class, 'update']);


// Eliminar una PQR
Route::delete('pqrs/{id}', [PQRController::class, 'destroy']);

//Ruta para finalizar y cerrar PQR
Route::post('pqr/{id}/finalize', [PQRController::class, 'finalizeResponse'])->middleware('auth:sanctum');

// ----------- RESPUESTAS PQR -------------
Route::prefix('pqr')->group(function () {
    // Ruta para mostrar el formulario de respuesta (GET)
    Route::get('responder/{uuid}', [CommunicationController::class, 'showResponseForm'])->name('pqr.show-response-form');

    // Ruta para procesar la respuesta con archivos (POST)
    Route::post('responder/{uuid}', [CommunicationController::class, 'processResponse'])->name('pqr.upload-response');

    // Ruta para crear comunicaciones (para admins autenticados)
    Route::post('{id}/comunicaciones', [CommunicationController::class, 'createCommunication'])
        ->middleware('auth:sanctum')
        ->name('pqr.create-communication');

    //Ruta para archivar y desarchivar comunicaciones
    Route::patch('comunicaciones/{communicationId}/archive', [CommunicationController::class, 'archiveCommunication'])
        ->middleware('auth:sanctum');
});

// ----------- LOGIN -------------
Route::middleware("api")->post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = \App\Models\User::where('email', $request->email)->first();

    if (!$user || !\Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Credenciales inválidas'], 401);
    }

    $token = $user->createToken('api_token')->plainTextToken;

    return response()->json([
        'success' => true,
        'token' => $token,
        'user' => $user
    ]);
});
