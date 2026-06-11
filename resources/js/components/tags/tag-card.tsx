import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { edit as editTag } from '@/routes/tags';
import type { Tag } from '@/types/tag';

type TagCardProps = {
    tag: Tag;
    onDelete: (tag: Tag) => void;
    deleting?: boolean;
};

export function TagCard({ tag, onDelete, deleting = false }: TagCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <CardTitle>{tag.name}</CardTitle>
                    <div className="flex shrink-0 gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <Link href={editTag({ tag: tag.id })}>Edit</Link>
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            disabled={deleting}
                            onClick={() => onDelete(tag)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                {tag.slug}
            </CardContent>
        </Card>
    );
}
