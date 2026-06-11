import { Head, router, usePage } from '@inertiajs/react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { TagForm } from '@/components/tags/tag-form';
import { Spinner } from '@/components/ui/spinner';
import { UPDATE_TAG } from '@/graphql/tags/mutations';
import { GET_TAG_BY_ID, GET_TAGS } from '@/graphql/tags/queries';
import { useTagForm } from '@/hooks/use-tag-form';
import { apolloClient } from '@/lib/apollo';
import { slugify, validateTagForm } from '@/lib/category-tag-validation';
import { getGraphQLErrorMessage } from '@/lib/graphql-errors';
import { index as tagsIndex } from '@/routes/tags';
import type { Tag } from '@/types/tag';

type PageProps = {
    tag: string;
};

type TagQueryResult = {
    tag: Tag;
};

export default function EditTag() {
    const { tag: tagId } = usePage<PageProps>().props;
    const { values, setField, setValues } = useTagForm();
    const { data, loading, error } = useQuery<TagQueryResult>(GET_TAG_BY_ID, {
        variables: { id: tagId },
        skip: !tagId,
    });
    const [updateTag, { loading: saving }] = useMutation(UPDATE_TAG);

    useEffect(() => {
        if (!data?.tag) {
            return;
        }

        setValues({
            name: data.tag.name,
            slug: data.tag.slug,
        });
    }, [data?.tag, setValues]);

    const handleSubmit = async () => {
        const payload = {
            name: values.name.trim(),
            slug: slugify(values.slug),
        };

        const validationError = validateTagForm(payload);

        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            await updateTag({
                variables: {
                    id: tagId,
                    ...payload,
                },
            });

            await apolloClient.refetchQueries({ include: [GET_TAGS] });

            toast.success('Tag updated successfully.');
            router.visit(tagsIndex().url);
        } catch (error) {
            toast.error(getGraphQLErrorMessage(error));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner className="size-6" />
            </div>
        );
    }

    if (error || !data?.tag) {
        return (
            <p className="p-4 text-sm text-destructive">
                {error?.message ?? 'Tag not found.'}
            </p>
        );
    }

    return (
        <>
            <Head title={`Edit ${data.tag.name}`} />
            <div className="space-y-6 p-4">
                <Heading title="Edit tag" description="Update tag details." />
                <TagForm
                    values={values}
                    submitting={saving}
                    submitLabel="Update tag"
                    onChange={setField}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}

EditTag.layout = {
    breadcrumbs: [
        { title: 'Tags', href: tagsIndex() },
        { title: 'Edit', href: '#' },
    ],
};
