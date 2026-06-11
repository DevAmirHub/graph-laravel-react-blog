import { gql } from '@apollo/client';

export const GET_USERS = gql`
    query GetUsers($name: String, $first: Int!, $page: Int) {
        users(name: $name, first: $first, page: $page) {
            data {
                id
                name
                email
                postsCount
                commentsCount
                created_at
            }
            paginatorInfo {
                total
                currentPage
                lastPage
                perPage
            }
        }
    }
`;

export const GET_USER_BY_ID = gql`
    query GetUserById($id: ID!) {
        user(id: $id) {
            id
            name
            email
            postsCount
            commentsCount
            created_at
            updated_at
        }
    }
`;
