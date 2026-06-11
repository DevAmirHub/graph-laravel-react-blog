import { gql } from '@apollo/client';
import { POST_DETAIL_FIELDS, POST_LIST_FIELDS } from '@/graphql/posts/fragments';

export const GET_PUBLISHED_POSTS = gql`
    query GetPublishedPosts(
        $title: String
        $first: Int!
        $page: Int
    ) {
        posts(title: $title, status: "published", first: $first, page: $page) {
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

export const GET_PUBLISHED_POST_BY_SLUG = gql`
    query GetPublishedPostBySlug($slug: String!) {
        postBySlug(slug: $slug) {
            ...PostDetailFields
        }
    }
    ${POST_DETAIL_FIELDS}
`;

export const GET_APPROVED_POST_COMMENTS = gql`
    query GetApprovedPostComments(
        $post_id: ID!
        $first: Int!
        $page: Int
    ) {
        comments(
            post_id: $post_id
            status: "approved"
            first: $first
            page: $page
        ) {
            data {
                id
                content
                created_at
                author {
                    id
                    name
                }
                parent {
                    id
                }
            }
            paginatorInfo {
                total
                currentPage
                lastPage
            }
        }
    }
`;
