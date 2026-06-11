import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { edit as editCategory } from '@/routes/categories';
import type { Category } from '@/types/category';

type CategoryCardProps = {
    category: Category;
    onDelete: (category: Category) => void;
    deleting?: boolean;
};

export function CategoryCard({
    category,
    onDelete,
    deleting = false,
}: CategoryCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                        <CardTitle>{category.name}</CardTitle>
                        {category.description && (
                            <CardDescription>
                                {category.description}
                            </CardDescription>
                        )}
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link
                                href={editCategory({
                                    category: category.id,
                                })}
                            >
                                Edit
                            </Link>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={deleting}
                            onClick={() => onDelete(category)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                {category.slug}
            </CardContent>
        </Card>
    );
}
