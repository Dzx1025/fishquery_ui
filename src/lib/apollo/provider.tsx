"use client";

import { ApolloProvider } from "@apollo/client";
import { getApolloClient } from "./client";
import { ReactNode } from "react";

export function ApolloWrapper({ children }: { children: ReactNode }) {
  const client = getApolloClient();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
