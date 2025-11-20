<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SheetController;


Route::middleware('auth:sanctum')->group(function () {


    Route::get('/folders/parent_id/{id}', [FolderController::class, 'getByParent'])
        ->name('api.folders.byParent');

    Route::get('/folders', [FolderController::class, 'index'])
        ->name('api.folders');

    Route::get('/allFolders', [FolderController::class, 'getAllFolders'])
        ->name('api.folders.all');


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

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::get('/users/filter', [UserController::class, 'userByFilter']);

    // ============================
    // TECHNICAL SHEETS
    // ============================
    Route::get('/sheets', [SheetController::class, 'index']);
    Route::get("/sheets/{id}", [SheetController::class, 'show']);
    Route::post('/sheets', [SheetController::class, 'store']);
    Route::put('/sheets/{id}', [SheetController::class, 'update']);
    Route::delete('/sheets', [SheetController::class, 'destroy']);

});

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
