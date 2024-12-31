// src/lib/apollo-client.ts
import {ApolloClient, from, HttpLink, InMemoryCache, split} from '@apollo/client';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {getMainDefinition} from '@apollo/client/utilities';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import {createClient} from 'graphql-ws';

const GRAPHQL_HTTP_URL = process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL;
const GRAPHQL_WS_URL = process.env.NEXT_PUBLIC_GRAPHQL_WS_URL;

const getToken = () => {
    if (typeof window === 'undefined') return null;
    try {
        return localStorage.getItem('accessToken');
    } catch {
        return null;
    }
};

// Error handling link
const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({message, locations, path}) => {
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
            );
        });
    }
    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

// HTTP link with authentication
const httpLink = new HttpLink({
    uri: GRAPHQL_HTTP_URL,
});

// Auth link
const authLink = setContext((_, {headers}) => {
    const token = getToken();
    return {
        headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
        }
    };
});

// WebSocket link
const wsLink = typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
            url: GRAPHQL_WS_URL!,
            connectionParams: () => {
                const token = getToken();
                return {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : '',
                    }
                };
            },
        })
    )
    : null;

// Split link logic
const splitLink = typeof window !== 'undefined' && wsLink
    ? split(
        ({query}) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            );
        },
        wsLink,
        authLink.concat(httpLink)
    )
    : authLink.concat(httpLink);

// Create cache
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                chat_conversation: {
                    merge(existing, incoming) {
                        return incoming;
                    },
                },
                chat_message: {
                    merge(existing, incoming) {
                        return incoming;
                    },
                },
            },
        },
    },
});

// Create client
const client = new ApolloClient({
    link: from([errorLink, splitLink]),
    cache,
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'network-only',
            nextFetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
});

export default client;