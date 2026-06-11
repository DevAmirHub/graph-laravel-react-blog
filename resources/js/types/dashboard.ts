import type { Category } from '@/types/category';
import type { Comment } from '@/types/comment';
import type { Post } from '@/types/post';
import type { Tag } from '@/types/tag';

export type DashboardUser = {
    id: string;
    name: string;
    email: string;
    postsCount: number;
    commentsCount: number;
    created_at: string;
};

export type DashboardPost = Post & {
    author?: { name: string };
    category?: { name: string } | null;
};

export type DashboardCategory = Category & {
    postsCount: number;
};

export type DashboardTag = Tag & {
    postsCount: number;
};

export type DashboardComment = Comment & {
    author?: { name: string };
    post?: { title: string };
};

export type StatusCount = {
    status: string;
    count: number;
};

export type NamedCount = {
    name: string;
    count: number;
};

export type MonthlyCount = {
    month: string;
    count: number;
};

export type DashboardAnalytics = {
    postsByStatus: StatusCount[];
    commentsByStatus: StatusCount[];
    topCategories: NamedCount[];
    topTags: NamedCount[];
    postsPerMonth: MonthlyCount[];
};

export type DashboardQueryResult = {
    usersCount: number;
    postsCount: number;
    categoriesCount: number;
    tagsCount: number;
    commentsCount: number;
    dashboardAnalytics: DashboardAnalytics;
    users: {
        data: DashboardUser[];
        paginatorInfo: { total: number };
    };
    posts: {
        data: DashboardPost[];
        paginatorInfo: { total: number };
    };
    categories: DashboardCategory[];
    tags: DashboardTag[];
    comments: {
        data: DashboardComment[];
        paginatorInfo: { total: number };
    };
};
