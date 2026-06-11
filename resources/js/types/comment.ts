export type CommentStatus = 'pending' | 'approved' | 'rejected';

export type CommentAuthor = {
    id: string;
    name: string;
};

export type CommentPost = {
    id: string;
    title: string;
    slug: string;
};

export type Comment = {
    id: string;
    content: string;
    status: CommentStatus;
    created_at: string;
    updated_at?: string;
    author?: CommentAuthor;
    post?: CommentPost;
    parent?: { id: string } | null;
};

export type PaginatorInfo = {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
};

export type CommentPaginator = {
    data: Comment[];
    paginatorInfo: PaginatorInfo;
};
