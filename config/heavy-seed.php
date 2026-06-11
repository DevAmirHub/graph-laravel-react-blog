<?php

return [
    'users' => (int) env('HEAVY_SEED_USERS', 3000),
    'categories' => (int) env('HEAVY_SEED_CATEGORIES', 50),
    'tags' => (int) env('HEAVY_SEED_TAGS', 100),
    'posts' => (int) env('HEAVY_SEED_POSTS', 5000),
    'comments' => (int) env('HEAVY_SEED_COMMENTS', 15000),
    'chunk' => (int) env('HEAVY_SEED_CHUNK', 500),
];
