import { gql } from '@apollo/client';

export const GET_TAGS = gql`
    query GetTags {
        tags {
            id
            name
            slug
            created_at
            updated_at
        }
    }
`;

export const GET_TAG_BY_ID = gql`
    query GetTagById($id: ID!) {
        tag(id: $id) {
            id
            name
            slug
            created_at
            updated_at
        }
    }
`;
