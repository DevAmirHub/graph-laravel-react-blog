import { Head, Link } from '@inertiajs/react';
import { useQuery } from '@apollo/client/react';
import { PublicPostCard } from '@/components/blog/public-post-card';
import { TechStackBadges } from '@/components/public/tech-stack-badges';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { GET_CATEGORIES } from '@/graphql/categories/queries';
import { GET_PUBLISHED_POSTS } from '@/graphql/blog/queries';
import { dashboard, login } from '@/routes';
import { index as blogIndex } from '@/routes/blog';
import type { Category } from '@/types/category';
import type { Post, PostPaginator } from '@/types/post';

type PostsQueryResult = {
    posts: PostPaginator;
};

type CategoriesQueryResult = {
    categories: Category[];
};

export default function Home() {
    const { data: postsData, loading: postsLoading } =
        useQuery<PostsQueryResult>(GET_PUBLISHED_POSTS, {
            variables: { first: 9, page: 1 },
        });

    const { data: categoriesData } = useQuery<CategoriesQueryResult>(
        GET_CATEGORIES,
    );

    const posts = postsData?.posts.data ?? [];
    const categories = categoriesData?.categories ?? [];

    return (
        <>
            <Head title="Home" />

            <section className="border-b bg-muted/30 py-16">
                <div className="mx-auto max-w-6xl px-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        GraphQL Blog
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        A full-stack blog demo powered by Laravel, Lighthouse,
                        React, Inertia, and Apollo Client — with an admin panel
                        for content management.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Button asChild size="lg">
                            <Link href={blogIndex()}>Browse posts</Link>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href={login()}>Admin demo</Link>
                        </Button>
                    </div>
                    <div className="mt-10">
                        <TechStackBadges />
                    </div>
                </div>
            </section>

            <section className="py-12">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mb-8 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                Latest posts
                            </h2>
                            <p className="text-muted-foreground">
                                Fetched via GraphQL — published posts only.
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={blogIndex()}>View all</Link>
                        </Button>
                    </div>

                    {postsLoading && (
                        <div className="flex justify-center py-16">
                            <Spinner className="size-6" />
                        </div>
                    )}

                    {!postsLoading && posts.length === 0 && (
                        <p className="text-muted-foreground">
                            No published posts yet.
                        </p>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post: Post) => (
                            <PublicPostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </section>

            {categories.length > 0 && (
                <section className="border-t bg-muted/20 py-12">
                    <div className="mx-auto max-w-6xl px-4">
                        <h2 className="mb-6 text-2xl font-semibold">
                            Categories
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {categories.slice(0, 12).map((category) => (
                                <Button
                                    key={category.id}
                                    variant="secondary"
                                    size="sm"
                                    asChild
                                >
                                    <Link href={blogIndex()}>{category.name}</Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="border-t py-12">
                <div className="mx-auto max-w-6xl px-4 text-center">
                    <h2 className="text-2xl font-semibold">Admin panel</h2>
                    <p className="mx-auto mt-2 max-w-xl text-muted-foreground">
                        Manage posts, categories, tags, comments, and users from
                        the dashboard. Log in with the demo account to explore.
                    </p>
                    <Button className="mt-6" asChild>
                        <Link href={dashboard()}>Open dashboard</Link>
                    </Button>
                </div>
            </section>
        </>
    );
}
