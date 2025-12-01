<?php

use App\Http\Controllers\Api\PQRController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SheetController;

Route::middleware('auth:sanctum')->group(function () {

    // --------- FOLDERS ---------
    Route::get('/folders/parent_id/{id}', [FolderController::class, 'getByParent']);
    Route::get('/folders', [FolderController::class, 'index']);
    Route::get('/allFolders', [FolderController::class, 'getAllFolders']);

    // --------- NOTIFICATIONS ---------
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/{id}', [NotificationController::class, 'show']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::get('/notifications/read', [NotificationController::class, 'read']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // ============= USERS API (Admin e Instructor) ==============
    Route::middleware('role:Admin|Instructor')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/filter', [UserController::class, 'userByFilter']);
        // ============= SHEETS ==============
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
        Route::delete('/sheets', [SheetController::class, 'destroy']);
        Route::delete('/sheets/delete/{numberSheet}/{idUser}', [SheetController::class, 'deleteUserFromSheet']);
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
