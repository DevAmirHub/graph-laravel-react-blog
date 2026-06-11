<?php

namespace App\GraphQL\Queries;

use App\Models\Category;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Support\Facades\DB;

final class DashboardAnalytics
{
    /**
     * @return array<string, mixed>
     */
    public function __invoke(mixed $_, array $args): array
    {
        return [
            'postsByStatus' => $this->countByStatus(Post::query(), 'status'),
            'commentsByStatus' => $this->countByStatus(Comment::query(), 'status'),
            'topCategories' => Category::query()
                ->withCount('posts')
                ->orderByDesc('posts_count')
                ->limit(10)
                ->get()
                ->map(fn (Category $category) => [
                    'name' => $category->name,
                    'count' => $category->posts_count,
                ])
                ->all(),
            'topTags' => Tag::query()
                ->withCount('posts')
                ->orderByDesc('posts_count')
                ->limit(10)
                ->get()
                ->map(fn (Tag $tag) => [
                    'name' => $tag->name,
                    'count' => $tag->posts_count,
                ])
                ->all(),
            'postsPerMonth' => $this->postsPerMonth(),
        ];
    }

    /**
     * @param  \Illuminate\Database\Eloquent\Builder<\Illuminate\Database\Eloquent\Model>  $query
     * @return list<array{status: string, count: int}>
     */
    private function countByStatus($query, string $column): array
    {
        return $query
            ->select($column, DB::raw('count(*) as aggregate'))
            ->groupBy($column)
            ->orderBy($column)
            ->get()
            ->map(fn ($row) => [
                'status' => (string) $row->{$column},
                'count' => (int) $row->aggregate,
            ])
            ->all();
    }

    /**
     * @return list<array{month: string, count: int}>
     */
    private function postsPerMonth(): array
    {
        $monthExpression = match (DB::connection()->getDriverName()) {
            'sqlite' => "strftime('%Y-%m', created_at)",
            'pgsql' => "to_char(created_at, 'YYYY-MM')",
            default => "DATE_FORMAT(created_at, '%Y-%m')",
        };

        $rows = Post::query()
            ->selectRaw("{$monthExpression} as month, count(*) as aggregate")
            ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $countsByMonth = $rows->mapWithKeys(
            fn ($row) => [(string) $row->month => (int) $row->aggregate],
        );

        $months = collect(range(0, 11))
            ->map(fn (int $offset) => now()->subMonths(11 - $offset)->format('Y-m'));

        return $months
            ->map(fn (string $month) => [
                'month' => $month,
                'count' => $countsByMonth->get($month, 0),
            ])
            ->all();
    }
}
