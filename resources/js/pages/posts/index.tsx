import { Head, Link } from '@inertiajs/react';
import { useQuery } from '@apollo/client/react';
import { useEffect, useMemo, useState } from 'react';
import Heading from '@/components/heading';
import { PostCard } from '@/components/posts/post-card';
import { PostFilters } from '@/components/posts/post-filters';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { GET_POSTS } from '@/graphql/posts/queries';
import { create as createPost, index as postsIndex } from '@/routes/posts';
import type { Post, PostPaginator, PostStatus } from '@/types/post';

type PostsQueryResult = {
    posts: PostPaginator;
};

export default function PostsIndex() {
    const [title, setTitle] = useState('');
    const [status, setStatus] = useState<PostStatus | 'all'>('all');
    const [page, setPage] = useState(1);

    useEffect(() => {
        setPage(1);
    }, [title, status]);

    const variables = useMemo(
        () => ({
            title: title.trim() ? `%${title.trim()}%` : undefined,
            status: status === 'all' ? undefined : status,
            first: 10,
            page,
        }),
        [title, status, page],
    );

    const { data, loading, error } = useQuery<PostsQueryResult>(GET_POSTS, {
        variables,
        notifyOnNetworkStatusChange: true,
    });

    const posts = data?.posts.data ?? [];
    const paginatorInfo = data?.posts.paginatorInfo;

    return (
        <>
            <Head title="Posts" />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="Posts"
                        description="Browse and manage blog posts."
                    />
                    <Button asChild>
                        <Link href={createPost()}>Create post</Link>
                    </Button>
                </div>

                <PostFilters
                    title={title}
                    status={status}
                    onTitleChange={setTitle}
                    onStatusChange={setStatus}
                />

                {loading && posts.length === 0 && (
                    <div className="flex justify-center py-10">
                        <Spinner className="size-6" />
                    </div>
                )}

                {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                )}

                {!loading && posts.length === 0 && !error && (
                    <p className="text-sm text-muted-foreground">
                        No posts found.
                    </p>
                )}

                <div className="grid gap-4">
                    {posts.map((post: Post) => (
                        <PostCard key={post.id} post={post} />
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

PostsIndex.layout = {
    breadcrumbs: [
        { title: 'Posts', href: postsIndex() },
    ],
};
