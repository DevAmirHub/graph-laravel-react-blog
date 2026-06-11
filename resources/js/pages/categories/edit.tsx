import { Head, router, usePage } from '@inertiajs/react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { CategoryForm } from '@/components/categories/category-form';
import Heading from '@/components/heading';
import { Spinner } from '@/components/ui/spinner';
import { UPDATE_CATEGORY } from '@/graphql/categories/mutations';
import {
    GET_CATEGORIES,
    GET_CATEGORY_BY_ID,
} from '@/graphql/categories/queries';
import { useCategoryForm } from '@/hooks/use-category-form';
import { apolloClient } from '@/lib/apollo';
import {
    slugify,
    validateCategoryForm,
} from '@/lib/category-tag-validation';
import { getGraphQLErrorMessage } from '@/lib/graphql-errors';
import { index as categoriesIndex } from '@/routes/categories';
import type { Category } from '@/types/category';

type PageProps = {
    category: string;
};

type CategoryQueryResult = {
    category: Category;
};

export default function EditCategory() {
    const { category: categoryId } = usePage<PageProps>().props;
    const { values, setField, setValues } = useCategoryForm();
    const { data, loading, error } = useQuery<CategoryQueryResult>(
        GET_CATEGORY_BY_ID,
        {
            variables: { id: categoryId },
            skip: !categoryId,
        },
    );
    const [updateCategory, { loading: saving }] = useMutation(UPDATE_CATEGORY);

    useEffect(() => {
        if (!data?.category) {
            return;
        }

        setValues({
            name: data.category.name,
            slug: data.category.slug,
            description: data.category.description ?? '',
        });
    }, [data?.category, setValues]);

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
            await updateCategory({
                variables: {
                    id: categoryId,
                    ...payload,
                    description: values.description.trim() || undefined,
                },
            });

            await apolloClient.refetchQueries({ include: [GET_CATEGORIES] });

            toast.success('Category updated successfully.');
            router.visit(categoriesIndex().url);
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

    if (error || !data?.category) {
        return (
            <p className="p-4 text-sm text-destructive">
                {error?.message ?? 'Category not found.'}
            </p>
        );
    }

    return (
        <>
            <Head title={`Edit ${data.category.name}`} />
            <div className="space-y-6 p-4">
                <Heading
                    title="Edit category"
                    description="Update category details."
                />
                <CategoryForm
                    values={values}
                    submitting={saving}
                    submitLabel="Update category"
                    onChange={setField}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}

EditCategory.layout = {
    breadcrumbs: [
        { title: 'Categories', href: categoriesIndex() },
        { title: 'Edit', href: '#' },
    ],
};
