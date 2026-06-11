import { Head, router } from '@inertiajs/react';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { CategoryForm } from '@/components/categories/category-form';
import Heading from '@/components/heading';
import { CREATE_CATEGORY } from '@/graphql/categories/mutations';
import { GET_CATEGORIES } from '@/graphql/categories/queries';
import { useCategoryForm } from '@/hooks/use-category-form';
import { apolloClient } from '@/lib/apollo';
import {
    slugify,
    validateCategoryForm,
} from '@/lib/category-tag-validation';
import { getGraphQLErrorMessage } from '@/lib/graphql-errors';
import {
    create as createCategoryRoute,
    index as categoriesIndex,
} from '@/routes/categories';

export default function CreateCategory() {
    const { values, setField, reset } = useCategoryForm();
    const [createCategory, { loading }] = useMutation(CREATE_CATEGORY);

    const handleSubmit = async () => {
        const payload = {
            name: values.name.trim(),
            slug: slugify(values.slug),
        };

        const validationError = validateCategoryForm(payload);

        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            await createCategory({
                variables: {
                    ...payload,
                    description: values.description.trim() || undefined,
                },
            });

            await apolloClient.refetchQueries({ include: [GET_CATEGORIES] });

            toast.success('Category created successfully.');
            reset();
            router.visit(categoriesIndex().url);
        } catch (error) {
            toast.error(getGraphQLErrorMessage(error));
        }
    };

    return (
        <>
            <Head title="Create category" />
            <div className="space-y-6 p-4">
                <Heading
                    title="Create category"
                    description="Add a new blog category."
                />
                <CategoryForm
                    values={values}
                    submitting={loading}
                    submitLabel="Create category"
                    onChange={setField}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}

CreateCategory.layout = {
    breadcrumbs: [
        { title: 'Categories', href: categoriesIndex() },
        { title: 'Create', href: createCategoryRoute() },
    ],
};
