import { gql } from '@apollo/client';

export const POST_LIST_FIELDS = gql`
    fragment PostListFields on Post {
        id
        title
        slug
        excerpt
        cover_image
        status
        views
        created_at
        author {
            id
            name
        }
        category {
            id
            name
            slug
        }
    }
`;

export const POST_DETAIL_FIELDS = gql`
    fragment PostDetailFields on Post {
        id
        title
        slug
        excerpt
        content
        cover_image
        status
        views
        created_at
        updated_at
        author {
            id
            name
        }
        category {
            id
            name
            slug
        }
        tags {
            id
            name
            slug
        }
    }
`;
