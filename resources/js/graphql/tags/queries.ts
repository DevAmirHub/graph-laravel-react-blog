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
