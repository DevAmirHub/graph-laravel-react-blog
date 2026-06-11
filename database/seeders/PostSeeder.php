<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $categories = Category::all();
        $tags = Tag::all();

        if ($users->isEmpty() || $categories->isEmpty() || $tags->isEmpty()) {
            return;
        }

        Post::factory()
            ->count(15)
            ->published()
            ->create([
                'user_id' => fn () => $users->random()->id,
                'category_id' => fn () => $categories->random()->id,
            ])
            ->each(function (Post $post) use ($tags): void {
                $post->tags()->attach(
                    $tags->random(fake()->numberBetween(1, 4))->pluck('id')->all(),
                );
            });

        Post::factory()
            ->count(5)
            ->draft()
            ->create([
                'user_id' => fn () => $users->random()->id,
                'category_id' => fn () => $categories->random()->id,
            ])
            ->each(function (Post $post) use ($tags): void {
                $post->tags()->attach(
                    $tags->random(fake()->numberBetween(1, 3))->pluck('id')->all(),
                );
            });

        Post::factory()
            ->count(3)
            ->archived()
            ->create([
                'user_id' => fn () => $users->random()->id,
                'category_id' => fn () => $categories->random()->id,
            ])
            ->each(function (Post $post) use ($tags): void {
                $post->tags()->attach(
                    $tags->random(fake()->numberBetween(1, 2))->pluck('id')->all(),
                );
            });
    }
}
