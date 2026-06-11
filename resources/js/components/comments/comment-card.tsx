import { Link } from '@inertiajs/react';
import { CommentStatusBadge } from '@/components/comments/comment-status-badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { edit as editComment } from '@/routes/comments';
import { show as showPost } from '@/routes/posts';
import type { Comment, CommentStatus } from '@/types/comment';

type CommentCardProps = {
    comment: Comment;
    updatingStatus?: boolean;
    deleting?: boolean;
    onStatusChange: (comment: Comment, status: CommentStatus) => void;
    onDelete: (comment: Comment) => void;
};

export function CommentCard({
    comment,
    updatingStatus = false,
    deleting = false,
    onStatusChange,
    onDelete,
}: CommentCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <CommentStatusBadge status={comment.status} />
                            {comment.author && (
                                <CardDescription>
                                    {comment.author.name}
                                </CardDescription>
                            )}
                        </div>
                        {comment.post && (
                            <CardTitle className="text-base">
                                <Link
                                    href={showPost({ post: comment.post.slug })}
                                    className="hover:underline"
                                >
                                    {comment.post.title}
                                </Link>
                            </CardTitle>
                        )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={editComment({ comment: comment.id })}
                            >
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={deleting}
                            onClick={() => onDelete(comment)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                <div className="flex flex-wrap items-end gap-3">
                    <div className="space-y-2 md:w-48">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <Select
                            value={comment.status}
                            disabled={updatingStatus}
                            onValueChange={(value) =>
                                onStatusChange(comment, value as CommentStatus)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString()}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
