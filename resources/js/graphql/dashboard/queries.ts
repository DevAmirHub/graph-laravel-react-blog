import { gql } from '@apollo/client';

export const GET_DASHBOARD = gql`
    query GetDashboard($listLimit: Int! = 25) {
        usersCount
        postsCount
        categoriesCount
        tagsCount
        commentsCount

        dashboardAnalytics {
            postsByStatus {
                status
                count
            }
            commentsByStatus {
                status
                count
            }
            topCategories {
                name
                count
            }
            topTags {
                name
                count
            }
            postsPerMonth {
                month
                count
            }
        }

        users(first: $listLimit, page: 1) {
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
            }
        }

        posts(first: $listLimit, page: 1) {
            data {
                id
                title
                slug
                status
                views
                created_at
                author {
                    name
                }
                category {
                    name
                }
            }
            paginatorInfo {
                total
            }
        }

        categories {
            id
            name
            slug
            postsCount
            created_at
        }

        tags {
            id
            name
            slug
            postsCount
            created_at
        }

        comments(first: $listLimit, page: 1) {
            data {
                id
                content
                status
                created_at
                author {
                    name
                }
                post {
                    title
                }
            }
            paginatorInfo {
                total
            }
        }
    }
`;
