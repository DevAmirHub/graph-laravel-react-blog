import { Head } from '@inertiajs/react';
import { useQuery } from '@apollo/client/react';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { GET_TAGS } from '@/graphql/tags/queries';
import { index as tagsIndex } from '@/routes/tags';
import type { Tag } from '@/types/tag';

type TagsQueryResult = {
    tags: Tag[];
};

export default function TagsIndex() {
    const { data, loading, error } = useQuery<TagsQueryResult>(GET_TAGS);
    const tags = data?.tags ?? [];

    return (
        <>
            <Head title="Tags" />
            <div className="space-y-6 p-4">
                <Heading title="Tags" description="Manage blog tags." />

                {loading && (
                    <div className="flex justify-center py-10">
                        <Spinner className="size-6" />
                    </div>
                )}

                {error && (
                    <p className="text-sm text-destructive">{error.message}</p>
                )}

                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Badge key={tag.id} variant="secondary">
                            {tag.name}
                        </Badge>
                    ))}
                </div>
            </div>
        </>
    );
}

TagsIndex.layout = {
    breadcrumbs: [
        { title: 'Tags', href: tagsIndex() },
    ],
};
