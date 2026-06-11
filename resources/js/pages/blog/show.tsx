import { Head, Link, usePage } from '@inertiajs/react';
import { useQuery } from '@apollo/client/react';
import { PostCommentsList } from '@/components/blog/post-comments-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
    GET_APPROVED_POST_COMMENTS,
    GET_PUBLISHED_POST_BY_SLUG,
} from '@/graphql/blog/queries';
import { edit as editPost } from '@/routes/posts';
import { index as blogIndex } from '@/routes/blog';
import type { CommentPaginator } from '@/types/comment';
import type { Post } from '@/types/post';

type PageProps = {
    post: string;
    auth: {
        user: unknown | null;
    };
};

type PostQueryResult = {
    postBySlug: Post;
};

type CommentsQueryResult = {
    comments: CommentPaginator;
};

export default function BlogShow() {
    const { post: slug, auth } = usePage<PageProps>().props;

    const { data, loading, error } = useQuery<PostQueryResult>(
        GET_PUBLISHED_POST_BY_SLUG,
        {
            variables: { slug },
            skip: !slug,
        },
    );

    const post = data?.postBySlug;
    const isPublished = post?.status === 'published';

    const { data: commentsData, loading: commentsLoading } =
        useQuery<CommentsQueryResult>(GET_APPROVED_POST_COMMENTS, {
            variables: { post_id: post?.id, first: 50, page: 1 },
            skip: !post?.id || !isPublished,
        });

    const comments = commentsData?.comments.data ?? [];

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Spinner className="size-6" />
            </div>
        );
    }

    if (error || !post || (!isPublished && !auth.user)) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-20 text-center">
                <p className="text-destructive">
                    {error?.message ?? 'Post not found.'}
                </p>
                <Button className="mt-4" variant="outline" asChild>
                    <Link href={blogIndex()}>Back to blog</Link>
                </Button>
            </div>
        );
    }

    return (
        <>
            <Head title={post.title} />
            <article className="mx-auto max-w-3xl space-y-8 px-4 py-10">
                <div className="space-y-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={blogIndex()}>← Back to blog</Link>
                    </Button>

                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            {post.title}
                        </h1>
                        {auth.user && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href={editPost({ post: post.id })}>
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>

                    {post.excerpt && (
                        <p className="text-lg text-muted-foreground">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        {post.author && <span>{post.author.name}</span>}
                        {post.category && (
                            <Badge variant="secondary">
                                {post.category.name}
                            </Badge>
                        )}
                        {post.created_at && (
                            <span>
                                {new Date(post.created_at).toLocaleDateString(
                                    undefined,
                                    {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    },
                                )}
                            </span>
                        )}
                        <span>{post.views} views</span>
                    </div>
                </div>

                {post.cover_image && (
                    <img
                        src={`/storage/${post.cover_image}`}
                        alt={post.title}
                        className="w-full rounded-xl object-cover"
                    />
                )}

                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <Badge key={tag.id} variant="outline">
                                {tag.name}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                    {post.content}
                </div>

                <section className="space-y-4 border-t pt-8">
                    <h2 className="text-xl font-semibold">
                        Comments ({commentsData?.comments.paginatorInfo.total ?? 0})
                    </h2>
                    {commentsLoading ? (
                        <div className="flex justify-center py-6">
                            <Spinner className="size-5" />
                        </div>
                    ) : (
                        <PostCommentsList comments={comments} />
                    )}
                </section>
            </article>
        </>
    );
}
