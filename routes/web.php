<?php

use App\Http\Controllers\ExplorerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
        return Inertia::render('Inbox');
})->name('inbox');


Route::get('explorer', [ExplorerController::class, 'index'])->name('explorer');

Route::get('archive' , function () {
    return Inertia::render('Archive');
})->name('archive');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
