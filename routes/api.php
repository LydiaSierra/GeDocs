<?php

use App\Http\Controllers\FolderController;
use Illuminate\Support\Facades\Route;

Route::get('folders/parent_id/{id}', [FolderController::class, 'getByParent']);
Route::apiResource('folders', FolderController::class);
