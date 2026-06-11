import { gql } from '@apollo/client';

export const CREATE_TAG = gql`
    mutation CreateTag($name: String!, $slug: String!) {
        createTag(name: $name, slug: $slug) {
            id
            name
            slug
        }
    }
`;

export const UPDATE_TAG = gql`
    mutation UpdateTag($id: ID!, $name: String, $slug: String) {
        updateTag(id: $id, name: $name, slug: $slug) {
            id
            name
            slug
        }
    }
`;

export const DELETE_TAG = gql`
    mutation DeleteTag($id: ID!) {
        deleteTag(id: $id) {
            id
        }
    }
`;
