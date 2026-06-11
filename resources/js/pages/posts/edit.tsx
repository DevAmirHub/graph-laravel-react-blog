import { Head, router, usePage } from '@inertiajs/react';
import { useMutation, useQuery } from '@apollo/client/react';
import { useEffect } from 'react';
import Heading from '@/components/heading';
import { PostForm } from '@/components/posts/post-form';
import { UPDATE_POST } from '@/graphql/posts/mutations';
import { GET_POST_BY_ID } from '@/graphql/posts/queries';
import { GET_CATEGORIES } from '@/graphql/categories/queries';
import { GET_TAGS } from '@/graphql/tags/queries';
import { uploadCoverImage } from '@/hooks/use-cover-upload';
import { usePostForm } from '@/hooks/use-post-form';
import { Spinner } from '@/components/ui/spinner';
import { index as postsIndex } from '@/routes/posts';
import type { Category } from '@/types/category';
import type { Post } from '@/types/post';
import type { Tag } from '@/types/tag';

type PageProps = {
    post: string;
};

type PostQueryResult = {
    post: Post;
};

type CategoriesQueryResult = {
    categories: Category[];
};

type TagsQueryResult = {
    tags: Tag[];
};

export default function EditPost() {
    const { post: postId } = usePage<PageProps>().props;
    const { values, setField, setValues } = usePostForm();
    const { data, loading, error } = useQuery<PostQueryResult>(GET_POST_BY_ID, {
        variables: { id: postId },
    });
    const { data: categoriesData } = useQuery<CategoriesQueryResult>(
        GET_CATEGORIES,
    );
    const { data: tagsData } = useQuery<TagsQueryResult>(GET_TAGS);
    const [updatePost, { loading: saving }] = useMutation(UPDATE_POST);

    useEffect(() => {
        if (!data?.post) {
            return;
        }

        setValues({
            title: data.post.title,
            slug: data.post.slug,
            excerpt: data.post.excerpt ?? '',
            content: data.post.content ?? '',
            cover_image: data.post.cover_image ?? '',
            status: data.post.status,
            category_id: data.post.category?.id ?? '',
            tag_ids: data.post.tags?.map((tag) => tag.id) ?? [],
        });
    }, [data?.post, setValues]);

    const handleSubmit = async () => {
        await updatePost({
            variables: {
                id: postId,
                ...values,
                excerpt: values.excerpt || undefined,
                cover_image: values.cover_image || undefined,
                category_id: values.category_id || undefined,
                tags: { sync: values.tag_ids },
            },
        });

        router.visit(postsIndex().url);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <Spinner className="size-6" />
            </div>
        );
    }

    if (error || !data?.post) {
        return (
            <p className="p-4 text-sm text-destructive">
                {error?.message ?? 'Post not found.'}
            </p>
        );
    }

    return (
        <>
            <Head title={`Edit ${data.post.title}`} />
            <div className="space-y-6 p-4">
                <Heading
                    title="Edit post"
                    description="Update post content and metadata."
                />
                <PostForm
                    values={values}
                    categories={categoriesData?.categories ?? []}
                    tags={tagsData?.tags ?? []}
                    submitting={saving}
                    submitLabel="Update post"
                    onChange={setField}
                    onCoverUpload={async (file) => {
                        const result = await uploadCoverImage(file);
                        setField('cover_image', result.path);
                    }}
                    onSubmit={handleSubmit}
                />
            </div>
        </>
    );
}

EditPost.layout = {
    breadcrumbs: [
        { title: 'Posts', href: postsIndex() },
        { title: 'Edit', href: '#' },
    ],
};
