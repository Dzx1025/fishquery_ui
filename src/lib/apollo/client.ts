// lib/apollo/client.ts
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

// Function to get token for WebSocket connection
async function getTokenForWs() {
  try {
    const response = await fetch("/api/auth/token");
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.warn("Failed to get token for WebSocket connection", error);
    return "";
  }
}

const cookies = await getTokenForWs();

// Create an HTTP link (for queries and mutations)
const httpLink = new HttpLink({
  uri: "http://localhost:8080/v1/graphql",
  headers: {
    Authorization: `Bearer ${cookies}`,
  },
});

// Create a WebSocket link (for subscriptions)
const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: "ws://localhost:8080/v1/graphql",
          connectionParams: async () => {
            // For WebSocket connections, we need to get the token
            // Since the token is in an HTTP-only cookie, we can't directly access it
            // But we can assume the user is authenticated at this point
            return {
              headers: {
                Authorization: `Bearer ${cookies}`,
              },
            };
          },
        })
      )
    : null;

// Split links based on operation type
const splitLink =
  typeof window !== "undefined" && wsLink !== null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

// Create the Apollo Client instance
export const createApolloClient = () => {
  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: "network-only",
      },
    },
  });
};

// Export a singleton instance for client components
let apolloClient: ApolloClient<any>;

export function getApolloClient() {
  if (typeof window === "undefined") {
    // Always create a new client on the server
    return createApolloClient();
  }

  // Create the client once in the client
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }

  return apolloClient;
}
