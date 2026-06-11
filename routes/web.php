<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::inertia('posts', 'posts/index')->name('posts.index');
Route::inertia('posts/{post}', 'posts/show')->name('posts.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('posts/create', 'posts/create')->name('posts.create');
    Route::inertia('posts/{post}/edit', 'posts/edit')->name('posts.edit');
    Route::inertia('categories', 'categories/index')->name('categories.index');
    Route::inertia('tags', 'tags/index')->name('tags.index');
});

require __DIR__.'/settings.php';
