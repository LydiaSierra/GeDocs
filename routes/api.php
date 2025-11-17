<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\NotificationController;

// Rutas de carpetas (si deben ser públicas, las dejas así)
Route::get('folders/parent_id/{id}', [FolderController::class, 'getByParent']);
Route::apiResource('folders', FolderController::class);
Route::get('allFolders', [FolderController::class, 'getAllFolders']);

// Rutas de notificaciones protegidas
Route::middleware('auth')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread', [NotificationController::class, 'unread']);
    Route::get('/notifications/read', [NotificationController::class, 'read']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
});
