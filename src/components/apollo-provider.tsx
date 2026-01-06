"use client";

import * as React from "react";
import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { ApolloProvider } from "@apollo/client/react";

const GRAPHQL_HTTP_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL ||
  "http://localhost:8080/v1/graphql";

const GRAPHQL_WS_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || "ws://localhost:8080/v1/graphql";

function createApolloClient() {
  const httpLink = new HttpLink({
    uri: GRAPHQL_HTTP_URL,
    credentials: "include",
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: GRAPHQL_WS_URL,
    }),
  );

  // Split based on operation type
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === "OperationDefinition" &&
        definition.operation === "subscription"
      );
    },
    wsLink,
    httpLink,
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
}

// Create a singleton client instance
let apolloClient: ReturnType<typeof createApolloClient> | null = null;

function getApolloClient() {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const client = React.useMemo(() => getApolloClient(), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
