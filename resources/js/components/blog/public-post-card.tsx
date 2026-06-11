import { Link } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { show as showBlogPost } from '@/routes/blog';
import type { Post } from '@/types/post';

type PublicPostCardProps = {
    post: Post;
};

export function PublicPostCard({ post }: PublicPostCardProps) {
    return (
        <Card className="h-full transition-shadow hover:shadow-md">
            {post.cover_image && (
                <Link href={showBlogPost({ post: post.slug })}>
                    <img
                        src={`/storage/${post.cover_image}`}
                        alt={post.title}
                        className="aspect-[16/9] w-full rounded-t-xl object-cover"
                    />
                </Link>
            )}
            <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">
                    <Link
                        href={showBlogPost({ post: post.slug })}
                        className="hover:underline"
                    >
                        {post.title}
                    </Link>
                </CardTitle>
                {post.excerpt && (
                    <CardDescription className="line-clamp-3">
                        {post.excerpt}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                    {post.author && <span>{post.author.name}</span>}
                    {post.category && <span>{post.category.name}</span>}
                    {post.created_at && (
                        <span>
                            {new Date(post.created_at).toLocaleDateString(
                                undefined,
                                {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                },
                            )}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
