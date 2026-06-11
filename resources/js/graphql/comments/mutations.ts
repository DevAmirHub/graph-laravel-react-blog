import { gql } from '@apollo/client';

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
