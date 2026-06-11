import '@/lib/chart-config';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import { ChartCard } from '@/components/dashboard/chart-card';
import { chartColors, chartPalette } from '@/lib/chart-config';
import type { DashboardAnalytics } from '@/types/dashboard';

type DashboardChartsProps = {
    analytics?: DashboardAnalytics;
    loading?: boolean;
};

const statusLabels: Record<string, string> = {
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
};

function getStatusColor(status: string, fallbackIndex: number) {
    return (
        chartColors[status as keyof typeof chartColors] ??
        chartPalette[fallbackIndex % chartPalette.length]
    );
}

function formatMonthLabel(month: string) {
    const [year, monthNumber] = month.split('-');
    const date = new Date(Number(year), Number(monthNumber) - 1);

    return date.toLocaleDateString(undefined, {
        month: 'short',
        year: '2-digit',
    });
}

export function DashboardCharts({
    analytics,
    loading = false,
}: DashboardChartsProps) {
    const postsByStatus = analytics?.postsByStatus ?? [];
    const commentsByStatus = analytics?.commentsByStatus ?? [];
    const topCategories = analytics?.topCategories ?? [];
    const postsPerMonth = analytics?.postsPerMonth ?? [];

    const postsDoughnutData = {
        labels: postsByStatus.map(
            (item) => statusLabels[item.status] ?? item.status,
        ),
        datasets: [
            {
                data: postsByStatus.map((item) => item.count),
                backgroundColor: postsByStatus.map((item, index) =>
                    getStatusColor(item.status, index),
                ),
                borderWidth: 0,
            },
        ],
    };

    const commentsDoughnutData = {
        labels: commentsByStatus.map(
            (item) => statusLabels[item.status] ?? item.status,
        ),
        datasets: [
            {
                data: commentsByStatus.map((item) => item.count),
                backgroundColor: commentsByStatus.map((item, index) =>
                    getStatusColor(item.status, index),
                ),
                borderWidth: 0,
            },
        ],
    };

    const categoriesBarData = {
        labels: topCategories.map((item) => item.name),
        datasets: [
            {
                label: 'Posts',
                data: topCategories.map((item) => item.count),
                backgroundColor: chartPalette.map((color) => `${color}CC`),
                borderColor: chartPalette,
                borderWidth: 1,
                borderRadius: 6,
            },
        ],
    };

    const postsLineData = {
        labels: postsPerMonth.map((item) => formatMonthLabel(item.month)),
        datasets: [
            {
                label: 'Posts created',
                data: postsPerMonth.map((item) => item.count),
                borderColor: chartColors.primary,
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                fill: true,
                tension: 0.35,
                pointRadius: 3,
                pointHoverRadius: 5,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    return (
        <section className="grid gap-4 xl:grid-cols-2">
            <ChartCard
                title="Posts by status"
                description="Distribution of all posts in the database"
                loading={loading}
            >
                <Doughnut data={postsDoughnutData} options={doughnutOptions} />
            </ChartCard>

            <ChartCard
                title="Comments by status"
                description="Moderation breakdown across all comments"
                loading={loading}
            >
                <Doughnut
                    data={commentsDoughnutData}
                    options={doughnutOptions}
                />
            </ChartCard>

            <ChartCard
                title="Top categories"
                description="Categories ranked by number of posts"
                loading={loading}
            >
                <Bar data={categoriesBarData} options={barOptions} />
            </ChartCard>

            <ChartCard
                title="Posts over time"
                description="Posts created per month (last 12 months)"
                loading={loading}
            >
                <Line data={postsLineData} options={lineOptions} />
            </ChartCard>
        </section>
    );
}
