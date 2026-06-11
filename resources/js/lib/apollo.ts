import { ApolloClient, HttpLink, InMemoryCache, from } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { getCsrfToken } from '@/lib/csrf';

const graphqlUri = import.meta.env.VITE_GRAPHQL_URL ?? '/graphql';

const authLink = new SetContextLink((prevContext) => ({
    headers: {
        ...prevContext.headers,
        Accept: 'application/json',
        'X-XSRF-TOKEN': getCsrfToken(),
    },
}));

const httpLink = new HttpLink({
    uri: graphqlUri,
    credentials: 'same-origin',
});

export const apolloClient = new ApolloClient({
    link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
        },
    },
});
