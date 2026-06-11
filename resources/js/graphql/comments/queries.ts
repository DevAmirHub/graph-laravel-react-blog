import { gql } from '@apollo/client';

export const GET_COMMENTS = gql`
    query GetComments($status: String, $first: Int!, $page: Int) {
        comments(status: $status, first: $first, page: $page) {
            data {
                id
                content
                status
                created_at
                author {
                    id
                    name
                }
                post {
                    id
                    title
                    slug
                }
            }
            paginatorInfo {
                total
                currentPage
                lastPage
                perPage
            }
        }
    }
`;

export const GET_COMMENT_BY_ID = gql`
    query GetCommentById($id: ID!) {
        comment(id: $id) {
            id
            content
            status
            created_at
            updated_at
            author {
                id
                name
            }
            post {
                id
                title
                slug
            }
        }
    }
`;
