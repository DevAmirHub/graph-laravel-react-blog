import type { Comment } from '@/types/comment';

type PostCommentsListProps = {
    comments: Comment[];
};

export function PostCommentsList({ comments }: PostCommentsListProps) {
    const topLevel = comments.filter((comment) => !comment.parent);

    if (topLevel.length === 0) {
        return (
            <p className="text-sm text-muted-foreground">
                No comments yet.
            </p>
        );
    }

    return (
        <ul className="space-y-4">
            {topLevel.map((comment) => (
                <li
                    key={comment.id}
                    className="rounded-lg border bg-muted/30 p-4"
                >
                    <div className="mb-2 flex items-center justify-between gap-2 text-sm">
                        <span className="font-medium">
                            {comment.author?.name ?? 'Anonymous'}
                        </span>
                        {comment.created_at && (
                            <span className="text-muted-foreground">
                                {new Date(comment.created_at).toLocaleDateString(
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
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                </li>
            ))}
        </ul>
    );
}
