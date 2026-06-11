import { gql } from '@apollo/client';

export const CREATE_COMMENT = gql`
    mutation CreateComment(
        $content: String!
        $post_id: ID!
        $parent_id: ID
    ) {
        createComment(
            content: $content
            post_id: $post_id
            parent_id: $parent_id
        ) {
            id
            content
            status
            created_at
            author {
                id
                name
            }
        }
    }
`;

export const UPDATE_COMMENT = gql`
    mutation UpdateComment($id: ID!, $content: String, $status: String) {
        updateComment(id: $id, content: $content, status: $status) {
            id
            content
            status
        }
    }
`;

export const DELETE_COMMENT = gql`
    mutation DeleteComment($id: ID!) {
        deleteComment(id: $id) {
            id
        }
    }
`;
