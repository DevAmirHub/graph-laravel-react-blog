<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'home')->name('home');
Route::inertia('blog', 'blog/index')->name('blog.index');
Route::inertia('blog/{post}', 'blog/show')->name('blog.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('posts', 'posts/index')->name('posts.index');
    Route::inertia('posts/create', 'posts/create')->name('posts.create');
    Route::inertia('posts/{post}/edit', 'posts/edit')->name('posts.edit');
    Route::inertia('categories', 'categories/index')->name('categories.index');
    Route::inertia('categories/create', 'categories/create')->name('categories.create');
    Route::inertia('categories/{category}/edit', 'categories/edit')->name('categories.edit');
    Route::inertia('tags', 'tags/index')->name('tags.index');
    Route::inertia('tags/create', 'tags/create')->name('tags.create');
    Route::inertia('tags/{tag}/edit', 'tags/edit')->name('tags.edit');
    Route::inertia('comments', 'comments/index')->name('comments.index');
    Route::inertia('comments/{comment}/edit', 'comments/edit')->name('comments.edit');
    Route::inertia('users', 'users/index')->name('users.index');
    Route::inertia('users/create', 'users/create')->name('users.create');
    Route::inertia('users/{user}/edit', 'users/edit')->name('users.edit');
});

require __DIR__.'/settings.php';
