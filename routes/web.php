<?php

use App\Http\Controllers\CapsuleController;
use App\Http\Controllers\CapsuleFileController;
use App\Http\Controllers\CapsuleRecipientController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('dashboard')
        : Inertia::render('Welcome');
})->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::resource('capsules', CapsuleController::class);

    Route::post('/capsules/{capsule}/files', [CapsuleFileController::class, 'store'])->name('capsules.files.store');
    Route::delete('/capsules/{capsule}/files/{file}', [CapsuleFileController::class, 'destroy'])->name('capsules.files.destroy');

    Route::post('/capsules/{capsule}/recipients', [CapsuleRecipientController::class, 'store'])->name('capsules.recipients.store');
    Route::delete('/capsules/{capsule}/recipients/{recipient}', [CapsuleRecipientController::class, 'destroy'])->name('capsules.recipients.destroy');
});

require __DIR__.'/auth.php';
