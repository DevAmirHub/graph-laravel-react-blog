<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Nuwave\Lighthouse\Cache\QueryCache;

class ClearGraphQLCache extends Command
{
    protected $signature = 'graphql:clear-cache';

    protected $description = 'Clear Lighthouse GraphQL query cache and application cache';

    public function handle(QueryCache $queryCache): int
    {
        $queryCache->clear(opcacheTTLHours: null, opcacheOnly: false);

        Artisan::call('cache:clear');

        $this->components->info('GraphQL query cache cleared.');

        return self::SUCCESS;
    }
}
