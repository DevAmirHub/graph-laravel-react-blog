import { Head } from '@inertiajs/react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { CommentCard } from '@/components/comments/comment-card';
import { CommentFilters } from '@/components/comments/comment-filters';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
    DELETE_COMMENT,
    UPDATE_COMMENT,
} from '@/graphql/comments/mutations';
import { GET_COMMENTS } from '@/graphql/comments/queries';
import { apolloClient } from '@/lib/apollo';
import { getGraphQLErrorMessage } from '@/lib/graphql-errors';
import { index as commentsIndex } from '@/routes/comments';
import type {
    Comment,
    CommentPaginator,
    CommentStatus,
} from '@/types/comment';

type CommentsQueryResult = {
    comments: CommentPaginator;
};

export default function CommentsIndex() {
    const [status, setStatus] = useState<CommentStatus | 'all'>('all');
    const [page, setPage] = useState(1);
    const [commentToDelete, setCommentToDelete] = useState<Comment | null>(
        null,
    );
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        setPage(1);
    }, [status]);

    const variables = useMemo(
        () => ({
            status: status === 'all' ? undefined : status,
            first: 10,
            page,
        }),
        [status, page],
    );

    const { data, loading, error } = useQuery<CommentsQueryResult>(
        GET_COMMENTS,
        {
            variables,
            notifyOnNetworkStatusChange: true,
        },
    );

    const [deleteComment, { loading: deleting }] = useMutation(DELETE_COMMENT);
    const [updateComment] = useMutation(UPDATE_COMMENT);

    const comments = data?.comments.data ?? [];
    const paginatorInfo = data?.comments.paginatorInfo;

    const handleStatusChange = async (
        comment: Comment,
        nextStatus: CommentStatus,
    ) => {
        if (comment.status === nextStatus) {
            return;
        }

        setUpdatingId(comment.id);

        try {
            await updateComment({
                variables: {
                    id: comment.id,
                    status: nextStatus,
                },
            });

            await apolloClient.refetchQueries({ include: [GET_COMMENTS] });

            toast.success('Comment status updated.');
        } catch (updateError) {
            toast.error(getGraphQLErrorMessage(updateError));
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDelete = async () => {
        if (!commentToDelete) {
            return;
        }

        try {
            await deleteComment({
                variables: { id: commentToDelete.id },
            });

            await apolloClient.refetchQueries({ include: [GET_COMMENTS] });

            toast.success('Comment deleted successfully.');
            setCommentToDelete(null);
        } catch (deleteError) {
            toast.error(getGraphQLErrorMessage(deleteError));
        }
    };

    return (
        <>
            <Head title="Comments" />
            <div className="space-y-6 p-4">
                <Heading
                    title="Comments"
                    description="Moderate blog comments."
                />

                <CommentFilters status={status} onStatusChange={setStatus} />

                {loading && comments.length === 0 && (
                    <div className="flex justify-center py-10">
                        <Spinner className="size-6" />
                    </div>
                )}

                {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                )}

                {!loading && comments.length === 0 && !error && (
                    <p className="text-sm text-muted-foreground">
                        No comments found.
                    </p>
                )}

                <div className="grid gap-4">
                    {comments.map((comment) => (
                        <CommentCard
                            key={comment.id}
                            comment={comment}
                            updatingStatus={updatingId === comment.id}
                            deleting={deleting}
                            onStatusChange={handleStatusChange}
                            onDelete={setCommentToDelete}
                        />
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
                            comments)
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

            <DeleteConfirmDialog
                open={commentToDelete !== null}
                title="Delete comment"
                description="Are you sure you want to delete this comment? This action cannot be undone."
                deleting={deleting}
                onOpenChange={(open) => {
                    if (!open) {
                        setCommentToDelete(null);
                    }
                }}
                onConfirm={handleDelete}
            />
        </>
    );
}

CommentsIndex.layout = {
    breadcrumbs: [{ title: 'Comments', href: commentsIndex() }],
};
