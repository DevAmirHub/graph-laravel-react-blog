import { Head, Link, usePage } from '@inertiajs/react';
import { useQuery } from '@apollo/client/react';
import Heading from '@/components/heading';
import { PostStatusBadge } from '@/components/posts/post-status-badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { GET_POST_BY_SLUG } from '@/graphql/posts/queries';
import { edit as editPost, index as postsIndex, show as showPost } from '@/routes/posts';
import type { Post } from '@/types/post';

type PageProps = {
    post: string;
};

type PostQueryResult = {
    postBySlug: Post;
};

export default function ShowPost() {
    const { post: slug } = usePage<PageProps>().props;
    const { data, loading, error } = useQuery<PostQueryResult>(
        GET_POST_BY_SLUG,
        {
            variables: { slug },
            skip: !slug,
        },
    );

    const post = data?.postBySlug;

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner className="size-6" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <p className="p-4 text-sm text-destructive">
                {error?.message ?? 'Post not found.'}
            </p>
        );
    }

    return (
        <>
            <Head title={post.title} />
            <article className="space-y-6 p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title={post.title}
                        description={post.excerpt ?? undefined}
                    />
                    <div className="flex items-center gap-2">
                        <PostStatusBadge status={post.status} />
                        <Button asChild variant="outline">
                            <Link href={editPost({ post: post.id })}>Edit</Link>
                        </Button>
                    </div>
                </div>

                {post.cover_image && (
                    <img
                        src={`/storage/${post.cover_image}`}
                        alt={post.title}
                        className="max-h-96 w-full rounded-xl object-cover"
                    />
                )}

                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {post.author && <span>{post.author.name}</span>}
                    {post.category && <span>{post.category.name}</span>}
                    <span>{post.views} views</span>
                </div>

                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                    {post.content}
                </div>
            </article>
        </>
    );
}

ShowPost.layout = {
    breadcrumbs: [
        { title: 'Posts', href: postsIndex() },
        { title: 'Show', href: showPost({ post: '#' }) },
    ],
};
