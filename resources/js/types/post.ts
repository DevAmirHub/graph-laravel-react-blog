import type { Category } from '@/types/category';
import type { Tag } from '@/types/tag';

export type PostStatus = 'draft' | 'published' | 'archived';

export type PostAuthor = {
    id: string;
    name: string;
};

export type Post = {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    content?: string | null;
    cover_image?: string | null;
    status: PostStatus;
    views: number;
    created_at: string;
    updated_at: string;
    author?: PostAuthor;
    category?: Category | null;
    tags?: Tag[];
};

export type PaginatorInfo = {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
};

export type PostPaginator = {
    data: Post[];
    paginatorInfo: PaginatorInfo;
};
