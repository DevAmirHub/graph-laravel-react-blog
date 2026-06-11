import { Head, router } from '@inertiajs/react';
import { useMutation, useQuery } from '@apollo/client/react';
import Heading from '@/components/heading';
import { PostForm } from '@/components/posts/post-form';
import { CREATE_POST } from '@/graphql/posts/mutations';
import { GET_CATEGORIES } from '@/graphql/categories/queries';
import { GET_TAGS } from '@/graphql/tags/queries';
import { uploadCoverImage } from '@/hooks/use-cover-upload';
import { usePostForm } from '@/hooks/use-post-form';
import { create as createPostRoute, index as postsIndex } from '@/routes/posts';
import type { Category } from '@/types/category';
import type { Tag } from '@/types/tag';

type CategoriesQueryResult = {
    categories: Category[];
};

type TagsQueryResult = {
    tags: Tag[];
};

export default function CreatePost() {
    const { values, setField } = usePostForm();
    const { data: categoriesData } = useQuery<CategoriesQueryResult>(
        GET_CATEGORIES,
    );
    const { data: tagsData } = useQuery<TagsQueryResult>(GET_TAGS);
    const [createPost, { loading }] = useMutation(CREATE_POST);

    const handleSubmit = async () => {
        await createPost({
            variables: {
                ...values,
                excerpt: values.excerpt || undefined,
                cover_image: values.cover_image || undefined,
                tags: values.tag_ids.length
                    ? { connect: values.tag_ids }
                    : undefined,
            },
        });

        router.visit(postsIndex().url);
    };

    return (
        <>
            <Head title="Create post" />
            <div className="space-y-6 p-4">
                <Heading
                    title="Create post"
                    description="Write and publish a new blog post."
                />
                <PostForm
                    values={values}
                    categories={categoriesData?.categories ?? []}
                    tags={tagsData?.tags ?? []}
                    submitting={loading}
                    submitLabel="Create post"
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

CreatePost.layout = {
    breadcrumbs: [
        { title: 'Posts', href: postsIndex() },
        { title: 'Create', href: createPostRoute() },
    ],
};
