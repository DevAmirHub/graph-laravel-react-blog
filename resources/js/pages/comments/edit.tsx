import { Head, router, usePage } from '@inertiajs/react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { CommentForm } from '@/components/comments/comment-form';
import Heading from '@/components/heading';
import { Spinner } from '@/components/ui/spinner';
import { UPDATE_COMMENT } from '@/graphql/comments/mutations';
import {
    GET_COMMENT_BY_ID,
    GET_COMMENTS,
} from '@/graphql/comments/queries';
import { useCommentForm } from '@/hooks/use-comment-form';
import { apolloClient } from '@/lib/apollo';
import { validateCommentForm } from '@/lib/comment-validation';
import { getGraphQLErrorMessage } from '@/lib/graphql-errors';
import { index as commentsIndex } from '@/routes/comments';
import type { Comment, CommentStatus } from '@/types/comment';

type PageProps = {
    comment: string;
};

type CommentQueryResult = {
    comment: Comment;
};

export default function EditComment() {
    const { comment: commentId } = usePage<PageProps>().props;
    const { values, setField, setValues } = useCommentForm();
    const { data, loading, error } = useQuery<CommentQueryResult>(
        GET_COMMENT_BY_ID,
        {
            variables: { id: commentId },
            skip: !commentId,
        },
    );
    const [updateComment, { loading: saving }] = useMutation(UPDATE_COMMENT);

    useEffect(() => {
        if (!data?.comment) {
            return;
        }

        setValues({
            content: data.comment.content,
            status: data.comment.status as CommentStatus,
        });
    }, [data?.comment, setValues]);

    const handleSubmit = async () => {
        const content = values.content.trim();
        const validationError = validateCommentForm(content);

        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            await updateComment({
                variables: {
                    id: commentId,
                    content,
                    status: values.status,
                },
            });

            await apolloClient.refetchQueries({ include: [GET_COMMENTS] });

            toast.success('Comment updated successfully.');
            router.visit(commentsIndex().url);
        } catch (updateError) {
            toast.error(getGraphQLErrorMessage(updateError));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner className="size-6" />
            </div>
        );
    }

    if (error || !data?.comment) {
        return (
            <p className="p-4 text-sm text-destructive">
                {error?.message ?? 'Comment not found.'}
            </p>
        );
    }

    return (
        <>
            <Head title="Edit comment" />
            <div className="space-y-6 p-4">
                <Heading
                    title="Edit comment"
                    description={
                        data.comment.post
                            ? `On post: ${data.comment.post.title}`
                            : 'Update comment content and status.'
                    }
                />
                <CommentForm
                    values={values}
                    submitting={saving}
                    submitLabel="Update comment"
                    onChange={setField}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}

EditComment.layout = {
    breadcrumbs: [
        { title: 'Comments', href: commentsIndex() },
        { title: 'Edit', href: '#' },
    ],
};
