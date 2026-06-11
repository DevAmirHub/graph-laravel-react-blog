import { Head } from '@inertiajs/react';
import { useQuery } from '@apollo/client/react';
import { useEffect, useMemo, useState } from 'react';
import { PublicPostCard } from '@/components/blog/public-post-card';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { GET_PUBLISHED_POSTS } from '@/graphql/blog/queries';
import type { Post, PostPaginator } from '@/types/post';

type PostsQueryResult = {
    posts: PostPaginator;
};

export default function BlogIndex() {
    const [title, setTitle] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [title]);

    const variables = useMemo(
        () => ({
            title: title.trim() ? `%${title.trim()}%` : undefined,
            first: 12,
            page,
        }),
        [title, page],
    );

    const { data, loading, error } = useQuery<PostsQueryResult>(
        GET_PUBLISHED_POSTS,
        {
            variables,
            notifyOnNetworkStatusChange: true,
        },
    );

    const posts = data?.posts.data ?? [];
    const paginatorInfo = data?.posts.paginatorInfo;

    return (
        <>
            <Head title="Blog" />
            <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
                <Heading
                    title="Blog"
                    description="Published articles fetched from the GraphQL API."
                />

                <Input
                    placeholder="Search by title…"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="max-w-md"
                />

                {loading && posts.length === 0 && (
                    <div className="flex justify-center py-16">
                        <Spinner className="size-6" />
                    </div>
                )}

                {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                )}

                {!loading && posts.length === 0 && !error && (
                    <p className="text-muted-foreground">
                        No published posts found.
                    </p>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post: Post) => (
                        <PublicPostCard key={post.id} post={post} />
                    ))}
                </div>

                {paginatorInfo && paginatorInfo.lastPage > 1 && (
                    <div className="flex items-center justify-between gap-4">
                        <Button
                            variant="outline"
                            disabled={page <= 1}
                            onClick={() => setPage((current) => current - 1)}
                        >
                            Previous
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            Page {paginatorInfo.currentPage} of{' '}
                            {paginatorInfo.lastPage} ({paginatorInfo.total}{' '}
                            posts)
                        </p>
                        <Button
                            variant="outline"
                            disabled={page >= paginatorInfo.lastPage}
                            onClick={() => setPage((current) => current + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
