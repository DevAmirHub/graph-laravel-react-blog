<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $posts = Post::all();

        if ($users->isEmpty() || $posts->isEmpty()) {
            return;
        }

        Comment::factory()
            ->count(20)
            ->approved()
            ->create([
                'user_id' => fn () => $users->random()->id,
                'post_id' => fn () => $posts->random()->id,
            ]);

        Comment::factory()
            ->count(8)
            ->pending()
            ->create([
                'user_id' => fn () => $users->random()->id,
                'post_id' => fn () => $posts->random()->id,
            ]);

        Comment::factory()
            ->count(4)
            ->rejected()
            ->create([
                'user_id' => fn () => $users->random()->id,
                'post_id' => fn () => $posts->random()->id,
            ]);

        Comment::query()
            ->whereNull('parent_id')
            ->inRandomOrder()
            ->limit(6)
            ->get()
            ->each(function (Comment $parent) use ($users): void {
                Comment::factory()
                    ->count(fake()->numberBetween(1, 2))
                    ->approved()
                    ->reply($parent)
                    ->create([
                        'user_id' => fn () => $users->random()->id,
                    ]);
            });
    }
}
