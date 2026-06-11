import { gql } from '@apollo/client';
import { POST_DETAIL_FIELDS, POST_LIST_FIELDS } from '@/graphql/posts/fragments';

export const GET_POSTS = gql`
    query GetPosts($title: String, $status: String, $first: Int!, $page: Int) {
        posts(title: $title, status: $status, first: $first, page: $page) {
            data {
                ...PostListFields
            }
            paginatorInfo {
                total
                currentPage
                lastPage
                perPage
            }
        }
    }
    ${POST_LIST_FIELDS}
`;

export const GET_POST_BY_SLUG = gql`
    query GetPostBySlug($slug: String!) {
        postBySlug(slug: $slug) {
            ...PostDetailFields
        }
    }
    ${POST_DETAIL_FIELDS}
`;

export const GET_POST_BY_ID = gql`
    query GetPostById($id: ID!) {
        post(id: $id) {
            ...PostDetailFields
        }
    }
    ${POST_DETAIL_FIELDS}
`;
