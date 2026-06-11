import { Link } from '@inertiajs/react';
import { PostStatusBadge } from '@/components/posts/post-status-badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { show as showPost } from '@/routes/posts';
import type { Post } from '@/types/post';

export function PostCard({ post }: { post: Post }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle>
                            <Link
                                href={showPost({ post: post.slug })}
                                className="hover:underline"
                            >
                                {post.title}
                            </Link>
                        </CardTitle>
                        {post.excerpt && (
                            <CardDescription>{post.excerpt}</CardDescription>
                        )}
                    </div>
                    <PostStatusBadge status={post.status} />
                </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                <div className="flex flex-wrap gap-3">
                    {post.author && <span>{post.author.name}</span>}
                    {post.category && <span>{post.category.name}</span>}
                    <span>{post.views} views</span>
                </div>
            </CardContent>
        </Card>
    );
}
