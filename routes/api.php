<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Api\PQRController;


//Generar token para utilizar en postman
Route::post('/login', function (Request $request) {
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

//Rutas protegidas con sanctum
Route::middleware('auth:sanctum')->group(function () {
    //pqrs
    Route::apiResource('pqrs', PQRController::class);

    // Información del usuario autenticado
    Route::get('/me', function (Request $request) {
        return response()->json([
            'user' => $request->user()->load('role')
        ]);
    });

    //Ruta para responder pqrs
    Route::post('pqrs/{id}/respond', [PQRController::class, 'respond']);

    // Logout
    Route::post('/logout', function (Request $request) {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logout exitoso']);
    });
});
