"use client";

import {ApolloProvider} from "@apollo/client";
import {useApolloClient} from "./client";
import {ReactNode} from "react";

export function ApolloWrapper({children}: { children: ReactNode }) {
  const client = useApolloClient();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}