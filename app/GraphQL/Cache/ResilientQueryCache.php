<?php

namespace App\GraphQL\Cache;

use GraphQL\Language\AST\DocumentNode;
use Nuwave\Lighthouse\Cache\QueryCache;

class ResilientQueryCache extends QueryCache
{
    /** @param  \Closure(): DocumentNode  $parse */
    protected function fromStoreOrParse(string $hash, \Closure $parse): DocumentNode
    {
        $store = $this->makeCacheStore();
        $key = "lighthouse:query:{$hash}";

        $cached = $store->get($key);

        if ($cached instanceof DocumentNode) {
            return $cached;
        }

        if ($cached !== null) {
            $store->forget($key);
        }

        return $store->remember(key: $key, ttl: $this->ttl, callback: $parse);
    }
}
