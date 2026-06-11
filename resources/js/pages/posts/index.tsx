import { Head, Link } from '@inertiajs/react';
import { useQuery } from '@apollo/client/react';
import { useMemo, useState } from 'react';
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

    const variables = useMemo(
        () => ({
            title: title || undefined,
            status: status === 'all' ? undefined : status,
            first: 10,
            page: 1,
        }),
        [title, status],
    );

    const { data, loading, error } = useQuery<PostsQueryResult>(GET_POSTS, {
        variables,
    });

    const posts = data?.posts.data ?? [];

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

                {loading && (
                    <div className="flex justify-center py-10">
                        <Spinner className="size-6" />
                    </div>
                )}

                {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                )}

                <div className="grid gap-4">
                    {posts.map((post: Post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </>
    );
}

PostsIndex.layout = {
    breadcrumbs: [
        { title: 'Posts', href: postsIndex() },
    ],
};
