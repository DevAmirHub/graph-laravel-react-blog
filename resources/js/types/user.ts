export type User = {
    id: string;
    name: string;
    email: string;
    postsCount?: number;
    commentsCount?: number;
    created_at?: string;
    updated_at?: string;
};

export type UserPaginator = {
    data: User[];
    paginatorInfo: {
        total: number;
        currentPage: number;
        lastPage: number;
        perPage: number;
    };
};
