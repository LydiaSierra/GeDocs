<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\NotificationController;

//USERS
Route::apiResource('/users', App\Http\Controllers\UserController::class);
Route::apiResource('/users', \App\Http\Controllers\UserController::class);
