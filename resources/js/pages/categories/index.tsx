import { Head, Link } from '@inertiajs/react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { CategoryCard } from '@/components/categories/category-card';
import { DeleteConfirmDialog } from '@/components/delete-confirm-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { DELETE_CATEGORY } from '@/graphql/categories/mutations';
import { GET_CATEGORIES } from '@/graphql/categories/queries';
import { apolloClient } from '@/lib/apollo';
import { getGraphQLErrorMessage } from '@/lib/graphql-errors';
import {
    create as createCategory,
    index as categoriesIndex,
} from '@/routes/categories';
import type { Category } from '@/types/category';

type CategoriesQueryResult = {
    categories: Category[];
};

export default function CategoriesIndex() {
    const { data, loading, error } = useQuery<CategoriesQueryResult>(
        GET_CATEGORIES,
    );
    const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null,
    );

    const categories = data?.categories ?? [];

    const handleDelete = async () => {
        if (!categoryToDelete) {
            return;
        }

        try {
            await deleteCategory({
                variables: { id: categoryToDelete.id },
            });

            await apolloClient.refetchQueries({ include: [GET_CATEGORIES] });

            toast.success('Category deleted successfully.');
            setCategoryToDelete(null);
        } catch (deleteError) {
            toast.error(getGraphQLErrorMessage(deleteError));
        }
    };

    return (
        <>
            <Head title="Categories" />
            <div className="space-y-6 p-4">
                <div className="flex items-center justify-between gap-4">
                    <Heading
                        title="Categories"
                        description="Manage blog categories."
                    />
                    <Button asChild>
                        <Link href={createCategory()}>Create category</Link>
                    </Button>
                </div>

                {loading && categories.length === 0 && (
                    <div className="flex justify-center py-10">
                        <Spinner className="size-6" />
                    </div>
                )}

                {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                )}

                {!loading && categories.length === 0 && !error && (
                    <p className="text-sm text-muted-foreground">
                        No categories found.
                    </p>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    {categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            deleting={deleting}
                            onDelete={setCategoryToDelete}
                        />
                    ))}
                </div>
            </div>

            <DeleteConfirmDialog
                open={categoryToDelete !== null}
                title="Delete category"
                description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
                deleting={deleting}
                onOpenChange={(open) => {
                    if (!open) {
                        setCategoryToDelete(null);
                    }
                }}
                onConfirm={handleDelete}
            />
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Categories', href: categoriesIndex() },
    ],
};
