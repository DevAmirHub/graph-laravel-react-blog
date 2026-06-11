import { Head } from '@inertiajs/react';
import { useQuery } from '@apollo/client/react';
import Heading from '@/components/heading';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { GET_CATEGORIES } from '@/graphql/categories/queries';
import { index as categoriesIndex } from '@/routes/categories';
import type { Category } from '@/types/category';

type CategoriesQueryResult = {
    categories: Category[];
};

export default function CategoriesIndex() {
    const { data, loading, error } = useQuery<CategoriesQueryResult>(
        GET_CATEGORIES,
    );

    const categories = data?.categories ?? [];

    return (
        <>
            <Head title="Categories" />
            <div className="space-y-6 p-4">
                <Heading
                    title="Categories"
                    description="Manage blog categories."
                />

                {loading && (
                    <div className="flex justify-center py-10">
                        <Spinner className="size-6" />
                    </div>
                )}

                {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                    {categories.map((category) => (
                        <Card key={category.id}>
                            <CardHeader>
                                <CardTitle>{category.name}</CardTitle>
                                {category.description && (
                                    <CardDescription>
                                        {category.description}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                {category.slug}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

CategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Categories', href: categoriesIndex() },
    ],
};
