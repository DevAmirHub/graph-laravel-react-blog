import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation CreateUser($name: String!, $email: String!, $password: String!) {
        createUser(name: $name, email: $email, password: $password) {
            id
            name
            email
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser(
        $id: ID!
        $name: String
        $email: String
        $password: String
    ) {
        updateUser(id: $id, name: $name, email: $email, password: $password) {
            id
            name
            email
        }
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id) {
            id
        }
    }
`;
