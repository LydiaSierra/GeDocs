<?php

use App\Http\Controllers\Api\PQRController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Ruta para obtener usuario autenticado
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//Rutas para authentication
Route::post('/register', [App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);
Route::post('/login', [App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);


//Rutas para los PQRS (requieren authenticacion)
//Group -> metodo para agrupar multiples rutas
Route::middleware('auth:sanctum')->group(function (){
    Route::apiResource('pqrs', PQRController::class);
    // Route::get('pqrs', [PQRController::class, 'index']);
});
