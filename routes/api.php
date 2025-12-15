<?php

use App\Http\Controllers\Api\PQRController;
use App\Http\Controllers\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SheetController;

Route::middleware('auth:sanctum')->group(function () {

    // --------- FOLDERS ---------
    Route::get('/folders/parent_id/{id}', [FolderController::class, 'show']);
    Route::get('/folders', [FolderController::class, 'index']);
    Route::get('/folders-all', [FolderController::class, 'getAllFolders']);
    Route::post("/folders/{id}/upload", [FolderController::class, "upload"]);
    Route::delete('/folders/file/{fileId}', [FolderController::class, 'destroyFile']);

    // --------- NOTIFICATIONS ---------
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/{id}', [NotificationController::class, 'show']);
    Route::get('/notifications/filter/unread', [NotificationController::class, 'unread']);
    Route::get('/notifications/filter/read', [NotificationController::class, 'read']);
    Route::post('/notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);

    // ============= USERS API (Admin e Instructor) ==============
    Route::middleware('role:Admin|Instructor')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::get('/users/search/filter', [UserController::class, 'userByFilter']);

        // ============= FOLDERS ==============
        Route::post("/folders", [FolderController::class, "store"]);
        Route::delete('/folders/{folderId}', [FolderController::class, 'deleteFolder']);
        Route::put('/folders/{folderId}', [FolderController::class, 'updateFolder']);



        // ============= SHEETS ==============
        Route::post('/sheets/add/user/{numberSheet}/{idUser}', [SheetController::class, 'addUserFromSheet']);
        Route::get('/sheets', [SheetController::class, 'index']);
        Route::get("/sheets/{id}", [SheetController::class, 'show']);
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
