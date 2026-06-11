import { Head, router } from '@inertiajs/react';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import Heading from '@/components/heading';
import { TagForm } from '@/components/tags/tag-form';
import { CREATE_TAG } from '@/graphql/tags/mutations';
import { GET_TAGS } from '@/graphql/tags/queries';
import { useTagForm } from '@/hooks/use-tag-form';
import { apolloClient } from '@/lib/apollo';
import { slugify, validateTagForm } from '@/lib/category-tag-validation';
import { getGraphQLErrorMessage } from '@/lib/graphql-errors';
import { create as createTagRoute, index as tagsIndex } from '@/routes/tags';

export default function CreateTag() {
    const { values, setField, reset } = useTagForm();
    const [createTag, { loading }] = useMutation(CREATE_TAG);

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
            await createTag({ variables: payload });

            await apolloClient.refetchQueries({ include: [GET_TAGS] });

            toast.success('Tag created successfully.');
            reset();
            router.visit(tagsIndex().url);
        } catch (error) {
            toast.error(getGraphQLErrorMessage(error));
        }
    };

    return (
        <>
            <Head title="Create tag" />
            <div className="space-y-6 p-4">
                <Heading title="Create tag" description="Add a new blog tag." />
                <TagForm
                    values={values}
                    submitting={loading}
                    submitLabel="Create tag"
                    onChange={setField}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}

CreateTag.layout = {
    breadcrumbs: [
        { title: 'Tags', href: tagsIndex() },
        { title: 'Create', href: createTagRoute() },
    ],
};
