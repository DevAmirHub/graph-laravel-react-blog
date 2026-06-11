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

export type DashboardQueryResult = {
    usersCount: number;
    postsCount: number;
    categoriesCount: number;
    tagsCount: number;
    commentsCount: number;
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
