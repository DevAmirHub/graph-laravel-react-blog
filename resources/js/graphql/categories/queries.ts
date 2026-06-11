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

export const GET_CATEGORY_BY_ID = gql`
    query GetCategoryById($id: ID!) {
        category(id: $id) {
            id
            name
            slug
            description
            created_at
            updated_at
        }
    }
`;
