<?php

namespace App\Console\Commands;

use Database\Seeders\HeavyDatabaseSeeder;
use Illuminate\Console\Command;

class SeedHeavyDatabase extends Command
{
    /**
     * @var string
     */
    protected $signature = 'db:seed-heavy
                            {--users= : Number of users to create}
                            {--categories= : Number of categories to create}
                            {--tags= : Number of tags to create}
                            {--posts= : Number of posts to create}
                            {--comments= : Number of comments to create}
                            {--chunk= : Records per insert batch}';

    /**
     * @var string
     */
    protected $description = 'Seed a large dataset in chunks for benchmarking and dashboard testing';

    public function handle(): int
    {
        $seeder = new HeavyDatabaseSeeder;
        $seeder->setCommand($this);
        $seeder->users = $this->intOption('users', config('heavy-seed.users'));
        $seeder->categories = $this->intOption('categories', config('heavy-seed.categories'));
        $seeder->tags = $this->intOption('tags', config('heavy-seed.tags'));
        $seeder->posts = $this->intOption('posts', config('heavy-seed.posts'));
        $seeder->comments = $this->intOption('comments', config('heavy-seed.comments'));
        $seeder->chunk = max(50, $this->intOption('chunk', config('heavy-seed.chunk')));

        if (! $this->confirmSeedPlan($seeder)) {
            $this->components->warn('Heavy seed cancelled.');

            return self::SUCCESS;
        }

        $seeder->run();

        return self::SUCCESS;
    }

    private function intOption(string $name, int $default): int
    {
        $value = $this->option($name);

        if ($value === null || $value === '') {
            return $default;
        }

        return max(0, (int) $value);
    }

    private function confirmSeedPlan(HeavyDatabaseSeeder $seeder): bool
    {
        if ($this->option('no-interaction')) {
            return true;
        }

        $this->newLine();
        $this->components->info('This command appends data to the current database.');
        $this->components->info('Default password for bulk users: password');

        return $this->confirm(
            sprintf(
                'Seed %s users, %s categories, %s tags, %s posts, and %s comments?',
                number_format($seeder->users),
                number_format($seeder->categories),
                number_format($seeder->tags),
                number_format($seeder->posts),
                number_format($seeder->comments),
            ),
            true,
        );
    }
}
