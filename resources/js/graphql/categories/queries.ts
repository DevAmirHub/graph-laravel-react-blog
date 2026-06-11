import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
    query GetCategories {
        categories {
            id
            name
            slug
            description
            created_at
            updated_at
        }
    }
`;
