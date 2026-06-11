import { gql } from '@apollo/client';

export const CREATE_CATEGORY = gql`
    mutation CreateCategory(
        $name: String!
        $slug: String!
        $description: String
    ) {
        createCategory(
            name: $name
            slug: $slug
            description: $description
        ) {
            id
            name
            slug
            description
        }
    }
`;

export const UPDATE_CATEGORY = gql`
    mutation UpdateCategory(
        $id: ID!
        $name: String
        $slug: String
        $description: String
    ) {
        updateCategory(
            id: $id
            name: $name
            slug: $slug
            description: $description
        ) {
            id
            name
            slug
            description
        }
    }
`;

export const DELETE_CATEGORY = gql`
    mutation DeleteCategory($id: ID!) {
        deleteCategory(id: $id) {
            id
        }
    }
`;
