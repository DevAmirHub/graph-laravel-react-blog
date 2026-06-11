<?php

use App\Http\Controllers\Api\Uploads\UploadController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/upload/post-cover', [UploadController::class, 'postCover']);
    Route::post('/upload/avatar', [UploadController::class, 'avatar']);
});
