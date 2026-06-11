<?php

namespace Database\Seeders;

use App\Enums\CommentStatus;
use App\Enums\PostStatus;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Symfony\Component\Console\Helper\ProgressBar;

class HeavyDatabaseSeeder extends Seeder
{
    public int $users = 3000;

    public int $categories = 50;

    public int $tags = 100;

    public int $posts = 5000;

    public int $comments = 15000;

    public int $chunk = 500;

    /** @var list<int> */
    private array $userIds = [];

    /** @var list<int> */
    private array $categoryIds = [];

    /** @var list<int> */
    private array $tagIds = [];

    /** @var list<int> */
    private array $postIds = [];

    private string $hashedPassword;

    public function run(): void
    {
        $this->hashedPassword = Hash::make('password');
        $startedAt = microtime(true);

        $this->command?->info('Starting heavy database seed…');
        $this->command?->table(
            ['Entity', 'Count', 'Chunk size'],
            [
                ['Users', number_format($this->users), number_format($this->chunk)],
                ['Categories', number_format($this->categories), number_format($this->chunk)],
                ['Tags', number_format($this->tags), number_format($this->chunk)],
                ['Posts', number_format($this->posts), number_format($this->chunk)],
                ['Comments', number_format($this->comments), number_format($this->chunk)],
            ],
        );

        DB::disableQueryLog();

        $this->seedUsers();
        $this->seedCategories();
        $this->seedTags();
        $this->seedPosts();
        $this->seedPostTags();
        $this->seedComments();
        $this->seedCommentReplies();

        $elapsed = round(microtime(true) - $startedAt, 2);

        $this->command?->newLine();
        $this->command?->info("Heavy seed completed in {$elapsed}s.");
        $this->command?->table(
            ['Table', 'Total rows'],
            [
                ['users', number_format(User::count())],
                ['categories', number_format(Category::count())],
                ['tags', number_format(Tag::count())],
                ['posts', number_format(Post::count())],
                ['comments', number_format(Comment::count())],
                ['post_tag', number_format(DB::table('post_tag')->count())],
            ],
        );
    }

    private function seedUsers(): void
    {
        if ($this->users <= 0) {
            $this->userIds = User::query()->pluck('id')->all();

            return;
        }

        $this->command?->info('Seeding users…');
        $progress = $this->progressBar($this->users);
        $progress?->start();

        $offset = User::count();
        $now = now();

        for ($seeded = 0; $seeded < $this->users; $seeded += $this->chunk) {
            $batchSize = min($this->chunk, $this->users - $seeded);
            $rows = [];

            for ($i = 0; $i < $batchSize; $i++) {
                $index = $offset + $seeded + $i + 1;

                $rows[] = [
                    'name' => fake()->name(),
                    'email' => "bulk-user-{$index}@seed.test",
                    'email_verified_at' => $now,
                    'password' => $this->hashedPassword,
                    'remember_token' => Str::random(10),
                    'two_factor_secret' => null,
                    'two_factor_recovery_codes' => null,
                    'two_factor_confirmed_at' => null,
                    'created_at' => $this->randomTimestamp(),
                    'updated_at' => $now,
                ];
            }

            User::query()->insert($rows);
            $progress?->advance($batchSize);
        }

        $progress?->finish();
        $this->command?->newLine(2);

        $this->userIds = User::query()->pluck('id')->all();
    }

    private function seedCategories(): void
    {
        if ($this->categories <= 0) {
            $this->categoryIds = Category::query()->pluck('id')->all();

            return;
        }

        $this->command?->info('Seeding categories…');
        $progress = $this->progressBar($this->categories);
        $progress?->start();

        $offset = Category::count();
        $now = now();

        for ($seeded = 0; $seeded < $this->categories; $seeded += $this->chunk) {
            $batchSize = min($this->chunk, $this->categories - $seeded);
            $rows = [];

            for ($i = 0; $i < $batchSize; $i++) {
                $index = $offset + $seeded + $i + 1;
                $name = "Category {$index}";

                $rows[] = [
                    'name' => $name,
                    'slug' => Str::slug($name)."-{$index}",
                    'description' => fake()->sentence(12),
                    'created_at' => $this->randomTimestamp(),
                    'updated_at' => $now,
                ];
            }

            Category::query()->insert($rows);
            $progress?->advance($batchSize);
        }

        $progress?->finish();
        $this->command?->newLine(2);

        $this->categoryIds = Category::query()->pluck('id')->all();
    }

    private function seedTags(): void
    {
        if ($this->tags <= 0) {
            $this->tagIds = Tag::query()->pluck('id')->all();

            return;
        }

        $this->command?->info('Seeding tags…');
        $progress = $this->progressBar($this->tags);
        $progress?->start();

        $offset = Tag::count();
        $now = now();

        for ($seeded = 0; $seeded < $this->tags; $seeded += $this->chunk) {
            $batchSize = min($this->chunk, $this->tags - $seeded);
            $rows = [];

            for ($i = 0; $i < $batchSize; $i++) {
                $index = $offset + $seeded + $i + 1;
                $name = "Tag {$index}";

                $rows[] = [
                    'name' => $name,
                    'slug' => Str::slug($name)."-{$index}",
                    'created_at' => $this->randomTimestamp(),
                    'updated_at' => $now,
                ];
            }

            Tag::query()->insert($rows);
            $progress?->advance($batchSize);
        }

        $progress?->finish();
        $this->command?->newLine(2);

        $this->tagIds = Tag::query()->pluck('id')->all();
    }

    private function seedPosts(): void
    {
        if ($this->posts <= 0) {
            $this->postIds = Post::query()->pluck('id')->all();

            return;
        }

        if ($this->userIds === [] || $this->categoryIds === []) {
            $this->command?->warn('Skipping posts: users or categories are missing.');

            return;
        }

        $this->command?->info('Seeding posts…');
        $progress = $this->progressBar($this->posts);
        $progress?->start();

        $offset = Post::count();
        $userCount = count($this->userIds);
        $categoryCount = count($this->categoryIds);

        for ($seeded = 0; $seeded < $this->posts; $seeded += $this->chunk) {
            $batchSize = min($this->chunk, $this->posts - $seeded);
            $rows = [];

            for ($i = 0; $i < $batchSize; $i++) {
                $index = $offset + $seeded + $i + 1;
                $createdAt = $this->randomTimestamp();

                $rows[] = [
                    'user_id' => $this->userIds[random_int(0, $userCount - 1)],
                    'category_id' => $this->categoryIds[random_int(0, $categoryCount - 1)],
                    'title' => "Seeded post {$index}",
                    'slug' => "seeded-post-{$index}",
                    'excerpt' => fake()->sentence(16),
                    'content' => fake()->paragraphs(4, true),
                    'cover_image' => null,
                    'status' => $this->randomPostStatus(),
                    'views' => random_int(0, 25000),
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ];
            }

            Post::query()->insert($rows);
            $progress?->advance($batchSize);
        }

        $progress?->finish();
        $this->command?->newLine(2);

        $this->postIds = Post::query()->pluck('id')->all();
    }

    private function seedPostTags(): void
    {
        if ($this->posts <= 0 || $this->postIds === [] || $this->tagIds === []) {
            return;
        }

        $this->command?->info('Seeding post_tag pivot…');

        $tagCount = count($this->tagIds);
        $now = now();
        $totalLinks = 0;

        foreach (array_chunk($this->postIds, $this->chunk) as $postIdChunk) {
            $rows = [];

            foreach ($postIdChunk as $postId) {
                $selectedTags = $this->randomTagIds(
                    $this->tagIds,
                    $tagCount,
                    random_int(1, min(4, $tagCount)),
                );

                foreach ($selectedTags as $tagId) {
                    $rows[] = [
                        'post_id' => $postId,
                        'tag_id' => $tagId,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }
            }

            foreach (array_chunk($rows, $this->chunk) as $insertChunk) {
                DB::table('post_tag')->insertOrIgnore($insertChunk);
                $totalLinks += count($insertChunk);
            }
        }

        $this->command?->info('Created '.number_format($totalLinks).' post_tag links.');
        $this->command?->newLine();
    }

    private function seedComments(): void
    {
        if ($this->comments <= 0) {
            return;
        }

        if ($this->userIds === [] || $this->postIds === []) {
            $this->command?->warn('Skipping comments: users or posts are missing.');

            return;
        }

        $this->command?->info('Seeding comments…');
        $progress = $this->progressBar($this->comments);
        $progress?->start();

        $userCount = count($this->userIds);
        $postCount = count($this->postIds);

        for ($seeded = 0; $seeded < $this->comments; $seeded += $this->chunk) {
            $batchSize = min($this->chunk, $this->comments - $seeded);
            $rows = [];

            for ($i = 0; $i < $batchSize; $i++) {
                $createdAt = $this->randomTimestamp();

                $rows[] = [
                    'user_id' => $this->userIds[random_int(0, $userCount - 1)],
                    'post_id' => $this->postIds[random_int(0, $postCount - 1)],
                    'parent_id' => null,
                    'content' => fake()->paragraph(),
                    'status' => $this->randomCommentStatus(),
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ];
            }

            Comment::query()->insert($rows);
            $progress?->advance($batchSize);
        }

        $progress?->finish();
        $this->command?->newLine(2);
    }

    private function seedCommentReplies(): void
    {
        if ($this->comments <= 0 || $this->userIds === []) {
            return;
        }

        $replyTargetCount = (int) max(1, floor($this->comments * 0.08));
        $this->command?->info("Seeding up to {$replyTargetCount} comment replies…");

        $parents = Comment::query()
            ->whereNull('parent_id')
            ->inRandomOrder()
            ->limit($replyTargetCount)
            ->get(['id', 'post_id']);

        if ($parents->isEmpty()) {
            return;
        }

        $userCount = count($this->userIds);
        $now = now();
        $rows = [];

        foreach ($parents as $parent) {
            $replyCount = random_int(1, 2);

            for ($i = 0; $i < $replyCount; $i++) {
                $createdAt = $this->randomTimestamp();

                $rows[] = [
                    'user_id' => $this->userIds[random_int(0, $userCount - 1)],
                    'post_id' => $parent->post_id,
                    'parent_id' => $parent->id,
                    'content' => fake()->sentence(12),
                    'status' => CommentStatus::APPROVED->value,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ];
            }

            if (count($rows) >= $this->chunk) {
                Comment::query()->insert($rows);
                $rows = [];
            }
        }

        if ($rows !== []) {
            Comment::query()->insert($rows);
        }

        $this->command?->newLine();
    }

    /**
     * @param  list<int>  $tagIds
     * @return list<int>
     */
    private function randomTagIds(array $tagIds, int $tagCount, int $count): array
    {
        if ($count >= $tagCount) {
            return $tagIds;
        }

        $keys = array_rand(array_flip($tagIds), $count);

        return is_array($keys) ? array_values($keys) : [$keys];
    }

    private function randomPostStatus(): string
    {
        $roll = random_int(1, 100);

        if ($roll <= 70) {
            return PostStatus::PUBLISHED->value;
        }

        if ($roll <= 90) {
            return PostStatus::DRAFT->value;
        }

        return PostStatus::ARCHIVED->value;
    }

    private function randomCommentStatus(): string
    {
        $roll = random_int(1, 100);

        if ($roll <= 70) {
            return CommentStatus::APPROVED->value;
        }

        if ($roll <= 90) {
            return CommentStatus::PENDING->value;
        }

        return CommentStatus::REJECTED->value;
    }

    private function randomTimestamp(): Carbon
    {
        return Carbon::instance(fake()->dateTimeBetween('-24 months', 'now'));
    }

    private function progressBar(int $max): ?ProgressBar
    {
        if ($this->command === null) {
            return null;
        }

        return $this->command->getOutput()->createProgressBar($max);
    }
}
