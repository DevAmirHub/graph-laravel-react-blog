import { Head, Link } from '@inertiajs/react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import Heading from '@/components/heading';
import { TagCard } from '@/components/tags/tag-card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { DELETE_TAG } from '@/graphql/tags/mutations';
import { GET_TAGS } from '@/graphql/tags/queries';
import { apolloClient } from '@/lib/apollo';
import { getGraphQLErrorMessage } from '@/lib/graphql-errors';
import { create as createTag, index as tagsIndex } from '@/routes/tags';
import type { Tag } from '@/types/tag';

type TagsQueryResult = {
    tags: Tag[];
};

export default function TagsIndex() {
    const { data, loading, error } = useQuery<TagsQueryResult>(GET_TAGS);
    const [deleteTag, { loading: deleting }] = useMutation(DELETE_TAG);
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);

    const tags = data?.tags ?? [];

    const handleDelete = async () => {
        if (!tagToDelete) {
            return;
        }

        try {
            await deleteTag({
                variables: { id: tagToDelete.id },
            });

            await apolloClient.refetchQueries({ include: [GET_TAGS] });

            toast.success('Tag deleted successfully.');
            setTagToDelete(null);
        } catch (deleteError) {
            toast.error(getGraphQLErrorMessage(deleteError));
        }
    };

    return (
        <>
            <Head title="Tags" />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <Heading title="Tags" description="Manage blog tags." />
                    <Button asChild>
                        <Link href={createTag()}>Create tag</Link>
                    </Button>
                </div>

                {loading && tags.length === 0 && (
                    <div className="flex justify-center py-10">
                        <Spinner className="size-6" />
                    </div>
                )}

                {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                )}

                {!loading && tags.length === 0 && !error && (
                    <p className="text-sm text-muted-foreground">
                        No tags found.
                    </p>
                )}

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tags.map((tag) => (
                        <TagCard
                            key={tag.id}
                            tag={tag}
                            deleting={deleting}
                            onDelete={setTagToDelete}
                        />
                    ))}
                </div>
            </div>

            <DeleteConfirmDialog
                open={tagToDelete !== null}
                title="Delete tag"
                description={`Are you sure you want to delete "${tagToDelete?.name}"? This action cannot be undone.`}
                deleting={deleting}
                onOpenChange={(open) => {
                    if (!open) {
                        setTagToDelete(null);
                    }
                }}
                onConfirm={handleDelete}
            />
        </>
    );
}

TagsIndex.layout = {
    breadcrumbs: [
        { title: 'Tags', href: tagsIndex() },
    ],
};
