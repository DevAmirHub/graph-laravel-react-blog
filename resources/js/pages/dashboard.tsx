import { Head } from '@inertiajs/react';
import { useQuery } from '@apollo/client/react';
import {
    FileText,
    FolderOpen,
    MessageSquare,
    Tags,
    Users,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DashboardCharts } from '@/components/dashboard/dashboard-charts';
import { DashboardTable } from '@/components/dashboard/dashboard-table';
import { QueryPerformanceBar } from '@/components/dashboard/query-performance-bar';
import { StatCard } from '@/components/dashboard/stat-card';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { PostStatusBadge } from '@/components/posts/post-status-badge';
import { CommentStatusBadge } from '@/components/comments/comment-status-badge';
import { GET_DASHBOARD } from '@/graphql/dashboard/queries';
import { getGraphQLErrorMessage } from '@/lib/graphql-errors';
import { dashboard } from '@/routes';
import type {
    DashboardCategory,
    DashboardComment,
    DashboardPost,
    DashboardQueryResult,
    DashboardTag,
    DashboardUser,
} from '@/types/dashboard';
import type { CommentStatus } from '@/types/comment';
import type { PostStatus } from '@/types/post';

const LIST_LIMIT = 25;

function formatDate(value: string) {
    return new Date(value).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function truncate(text: string, max = 60) {
    return text.length > max ? `${text.slice(0, max)}…` : text;
}

export default function Dashboard() {
    const queryStartedAt = useRef<number | null>(null);
    const [loadTimeMs, setLoadTimeMs] = useState<number | null>(null);
    const [fetchedAt, setFetchedAt] = useState<Date | null>(null);

    const { data, loading, error, refetch, networkStatus } =
        useQuery<DashboardQueryResult>(GET_DASHBOARD, {
            variables: { listLimit: LIST_LIMIT },
            notifyOnNetworkStatusChange: true,
        });

    const isRefreshing = networkStatus === 4;

    useEffect(() => {
        if (loading && queryStartedAt.current === null) {
            queryStartedAt.current = performance.now();
        }

        if (!loading && data && queryStartedAt.current !== null) {
            setLoadTimeMs(performance.now() - queryStartedAt.current);
            setFetchedAt(new Date());
            queryStartedAt.current = null;
        }
    }, [loading, data]);

    const handleRefresh = useCallback(() => {
        queryStartedAt.current = performance.now();
        void refetch();
    }, [refetch]);

    const users = data?.users.data ?? [];
    const posts = data?.posts.data ?? [];
    const categories = data?.categories ?? [];
    const tags = data?.tags ?? [];
    const comments = data?.comments.data ?? [];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Dashboard"
                    description="Live overview powered by a single GraphQL query — counts, charts, nested relations, and five data tables."
                />

                {error && (
                    <p className="text-sm text-destructive">
                        {getGraphQLErrorMessage(error)}
                    </p>
                )}

                <QueryPerformanceBar
                    loading={loading && !data}
                    loadTimeMs={loadTimeMs}
                    fetchedAt={fetchedAt}
                    onRefresh={handleRefresh}
                    refreshing={isRefreshing}
                />

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard
                        title="Users"
                        value={data?.usersCount ?? 0}
                        description="Registered accounts"
                        icon={Users}
                        loading={loading && !data}
                        accent="blue"
                    />
                    <StatCard
                        title="Posts"
                        value={data?.postsCount ?? 0}
                        description="Blog articles"
                        icon={FileText}
                        loading={loading && !data}
                        accent="green"
                    />
                    <StatCard
                        title="Categories"
                        value={data?.categoriesCount ?? 0}
                        description="Content groups"
                        icon={FolderOpen}
                        loading={loading && !data}
                        accent="amber"
                    />
                    <StatCard
                        title="Tags"
                        value={data?.tagsCount ?? 0}
                        description="Topic labels"
                        icon={Tags}
                        loading={loading && !data}
                        accent="violet"
                    />
                    <StatCard
                        title="Comments"
                        value={data?.commentsCount ?? 0}
                        description="User discussions"
                        icon={MessageSquare}
                        loading={loading && !data}
                        accent="rose"
                    />
                </section>

                <section className="grid gap-4 xl:grid-cols-2">
                    <DashboardTable<DashboardUser>
                        title="Users"
                        description={`Latest ${LIST_LIMIT} users with post & comment counts`}
                        rows={users}
                        total={data?.users.paginatorInfo.total}
                        loading={loading && !data}
                        columns={[
                            {
                                key: 'name',
                                header: 'Name',
                                render: (row) => (
                                    <span className="font-medium">
                                        {row.name}
                                    </span>
                                ),
                            },
                            {
                                key: 'email',
                                header: 'Email',
                                render: (row) => row.email,
                            },
                            {
                                key: 'posts',
                                header: 'Posts',
                                render: (row) => row.postsCount,
                            },
                            {
                                key: 'comments',
                                header: 'Comments',
                                render: (row) => row.commentsCount,
                            },
                            {
                                key: 'joined',
                                header: 'Joined',
                                render: (row) => formatDate(row.created_at),
                            },
                        ]}
                    />

                    <DashboardTable<DashboardPost>
                        title="Posts"
                        description={`Latest ${LIST_LIMIT} posts with author & category`}
                        rows={posts}
                        total={data?.posts.paginatorInfo.total}
                        loading={loading && !data}
                        columns={[
                            {
                                key: 'title',
                                header: 'Title',
                                render: (row) => (
                                    <span className="font-medium">
                                        {truncate(row.title, 40)}
                                    </span>
                                ),
                            },
                            {
                                key: 'status',
                                header: 'Status',
                                render: (row) => (
                                    <PostStatusBadge
                                        status={row.status as PostStatus}
                                    />
                                ),
                            },
                            {
                                key: 'author',
                                header: 'Author',
                                render: (row) => row.author?.name ?? '—',
                            },
                            {
                                key: 'category',
                                header: 'Category',
                                render: (row) => row.category?.name ?? '—',
                            },
                            {
                                key: 'views',
                                header: 'Views',
                                render: (row) => row.views,
                            },
                        ]}
                    />
                </section>

                <section className="grid gap-4 xl:grid-cols-3">
                    <DashboardTable<DashboardCategory>
                        title="Categories"
                        description="All categories with post counts"
                        rows={categories}
                        total={data?.categoriesCount}
                        loading={loading && !data}
                        columns={[
                            {
                                key: 'name',
                                header: 'Name',
                                render: (row) => (
                                    <span className="font-medium">
                                        {row.name}
                                    </span>
                                ),
                            },
                            {
                                key: 'slug',
                                header: 'Slug',
                                render: (row) => (
                                    <code className="text-xs">{row.slug}</code>
                                ),
                            },
                            {
                                key: 'posts',
                                header: 'Posts',
                                render: (row) => (
                                    <Badge variant="outline">
                                        {row.postsCount}
                                    </Badge>
                                ),
                            },
                        ]}
                    />

                    <DashboardTable<DashboardTag>
                        title="Tags"
                        description="All tags with usage counts"
                        rows={tags}
                        total={data?.tagsCount}
                        loading={loading && !data}
                        columns={[
                            {
                                key: 'name',
                                header: 'Name',
                                render: (row) => (
                                    <span className="font-medium">
                                        {row.name}
                                    </span>
                                ),
                            },
                            {
                                key: 'slug',
                                header: 'Slug',
                                render: (row) => (
                                    <code className="text-xs">{row.slug}</code>
                                ),
                            },
                            {
                                key: 'posts',
                                header: 'Posts',
                                render: (row) => (
                                    <Badge variant="outline">
                                        {row.postsCount}
                                    </Badge>
                                ),
                            },
                        ]}
                    />

                    <DashboardTable<DashboardComment>
                        title="Comments"
                        description={`Latest ${LIST_LIMIT} comments for moderation`}
                        rows={comments}
                        total={data?.comments.paginatorInfo.total}
                        loading={loading && !data}
                        columns={[
                            {
                                key: 'content',
                                header: 'Content',
                                className: 'max-w-48',
                                render: (row) => truncate(row.content, 50),
                            },
                            {
                                key: 'status',
                                header: 'Status',
                                render: (row) => (
                                    <CommentStatusBadge
                                        status={row.status as CommentStatus}
                                    />
                                ),
                            },
                            {
                                key: 'author',
                                header: 'Author',
                                render: (row) => row.author?.name ?? '—',
                            },
                            {
                                key: 'post',
                                header: 'Post',
                                render: (row) =>
                                    truncate(row.post?.title ?? '—', 24),
                            },
                        ]}
                    />
                </section>

                <DashboardCharts
                    analytics={data?.dashboardAnalytics}
                    loading={loading && !data}
                />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
