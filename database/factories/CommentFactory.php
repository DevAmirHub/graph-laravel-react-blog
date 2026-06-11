<?php

namespace Database\Factories;

use App\Enums\CommentStatus;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Comment>
 */
class CommentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'post_id' => Post::factory(),
            'parent_id' => null,
            'content' => fake()->paragraph(),
            'status' => fake()->randomElement(array_column(CommentStatus::cases(), 'value')),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => CommentStatus::PENDING->value,
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => CommentStatus::APPROVED->value,
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => CommentStatus::REJECTED->value,
        ]);
    }

    public function reply(Comment $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'post_id' => $parent->post_id,
            'parent_id' => $parent->id,
        ]);
    }
}
