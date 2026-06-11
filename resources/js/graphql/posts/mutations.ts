import { gql } from '@apollo/client';
import { POST_DETAIL_FIELDS } from '@/graphql/posts/fragments';

export const CREATE_POST = gql`
    mutation CreatePost(
        $title: String!
        $slug: String!
        $excerpt: String
        $content: String!
        $cover_image: String
        $status: String!
        $category_id: ID!
        $tags: PostTagsRelation
    ) {
        createPost(
            title: $title
            slug: $slug
            excerpt: $excerpt
            content: $content
            cover_image: $cover_image
            status: $status
            category_id: $category_id
            tags: $tags
        ) {
            ...PostDetailFields
        }
    }
    ${POST_DETAIL_FIELDS}
`;

export const UPDATE_POST = gql`
    mutation UpdatePost(
        $id: ID!
        $title: String
        $slug: String
        $excerpt: String
        $content: String
        $cover_image: String
        $status: String
        $category_id: ID
        $tags: PostTagsRelation
    ) {
        updatePost(
            id: $id
            title: $title
            slug: $slug
            excerpt: $excerpt
            content: $content
            cover_image: $cover_image
            status: $status
            category_id: $category_id
            tags: $tags
        ) {
            ...PostDetailFields
        }
    }
    ${POST_DETAIL_FIELDS}
`;

export const DELETE_POST = gql`
    mutation DeletePost($id: ID!) {
        deletePost(id: $id) {
            id
        }
    }
`;
