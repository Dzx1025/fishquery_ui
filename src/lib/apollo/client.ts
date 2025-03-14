// lib/apollo/client.ts
import {ApolloClient, from, HttpLink, InMemoryCache, Observable, split,} from "@apollo/client";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {getMainDefinition} from "@apollo/client/utilities";
import {Client, createClient} from "graphql-ws";
import {onError} from "@apollo/client/link/error";
import {setContext} from "@apollo/client/link/context";
import {useEffect, useState} from "react";

// User management interface
interface UserContext {
  userId: string | null;
  isAuthenticated: boolean;
}

// Token Management Class
class TokenManager {
  private static instance: TokenManager;
  private tokenCache: Record<string, string> = {};
  private tokenPromises: Record<string, Promise<string> | null> = {};
  private currentUserId: string | null = null;
  private changeListeners: Array<() => void> = [];

  private constructor() {
  }

  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  // Set current user ID
  public setCurrentUser(userId: string | null): void {
    if (this.currentUserId === userId) return;

    console.log(
      `Switching user from ${this.currentUserId || "none"} to ${
        userId || "none"
      }`
    );
    this.currentUserId = userId;

    // Trigger user change event
    this.notifyListeners();
  }

  // Get current user ID
  public getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  // Get token for specified user
  public async getToken(forceRefresh = false): Promise<string> {
    const userId = this.currentUserId || "anonymous";

    // Return from cache if available and refresh not forced
    if (this.tokenCache[userId] && !forceRefresh) {
      return this.tokenCache[userId];
    }

    // If a request is already in progress, wait for it
    if (this.tokenPromises[userId]) {
      return this.tokenPromises[userId]!;
    }

    // Start a new token fetch request
    this.tokenPromises[userId] = this.fetchTokenFromServer();

    try {
      const token = await this.tokenPromises[userId]!;
      this.tokenCache[userId] = token;
      return token;
    } finally {
      this.tokenPromises[userId] = null;
    }
  }

  // Force refresh current user's token
  public async refreshToken(): Promise<string> {
    return this.getToken(true);
  }

  // Clear token for specified user
  public clearToken(userId?: string | null): void {
    const targetId = userId || this.currentUserId || "anonymous";
    delete this.tokenCache[targetId];
  }

  // Clear all tokens
  public clearAllTokens(): void {
    this.tokenCache = {};
  }

  // Add change listener
  public addChangeListener(listener: () => void): () => void {
    this.changeListeners.push(listener);
    return () => {
      this.changeListeners = this.changeListeners.filter((l) => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.changeListeners.forEach((listener) => listener());
  }

  // Fetch token from server
  private async fetchTokenFromServer(): Promise<string> {
    try {
      const response = await fetch("/api/auth/token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Token fetch failed: ${response.status}`);
      }

      const data = await response.json();
      return data.token || "";
    } catch (error) {
      console.error("Failed to fetch token:", error);
      return "";
    }
  }
}

// Apollo Client Manager Class
class ApolloClientManager {
  private static instance: ApolloClientManager;
  private client: ApolloClient<any> | null = null;
  private wsClient: Client | null = null;
  private tokenManager: TokenManager;

  private constructor() {
    this.tokenManager = TokenManager.getInstance();

    // Listen for user changes to reset client
    this.tokenManager.addChangeListener(() => {
      this.resetClient();
    });
  }

  public static getInstance(): ApolloClientManager {
    if (!ApolloClientManager.instance) {
      ApolloClientManager.instance = new ApolloClientManager();
    }
    return ApolloClientManager.instance;
  }

  // Get Apollo client instance
  public getClient(): ApolloClient<any> {
    if (!this.client) {
      this.client = this.createNewClient();
    }
    return this.client;
  }

  // Set current user
  public setUser(user: UserContext): void {
    this.tokenManager.setCurrentUser(user.userId);
  }

  // User logout
  public logout(): void {
    this.tokenManager.setCurrentUser(null);
    this.tokenManager.clearAllTokens();
  }

  // Reset Apollo client
  private resetClient(): void {
    if (this.client) {
      // Stop all active queries
      this.client.stop();

      // Clear cache
      this.client.clearStore().catch((err) => {
        console.error("Error clearing Apollo cache:", err);
      });

      // Close WebSocket connection
      if (this.wsClient) {
        this.wsClient.dispose();
        this.wsClient = null;
      }

      // Reset client reference
      this.client = null;
    }
  }

  // Create new Apollo client
  private createNewClient(): ApolloClient<any> {
    // Create HTTP connection
    const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL || "http://localhost:8080/v1/graphql",
    });

    // Add authentication information
    const authLink = setContext(async (_, {headers}) => {
      const token = await this.tokenManager.getToken();
      return {
        headers: {
          ...headers,
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
    });
    // Error handling
    const errorLink = onError(
      ({graphQLErrors, networkError, operation, forward}) => {
        if (graphQLErrors) {
          for (const error of graphQLErrors) {
            // Check for authentication errors
            if (
              error.extensions?.code === "UNAUTHENTICATED" ||
              error.message.toLowerCase().includes("unauthorized") ||
              error.message.toLowerCase().includes("authentication")
            ) {
              // Refresh token and retry request
              // Don't return a Promise, but an Observable directly
              return new Observable((observer) => {
                this.tokenManager
                  .refreshToken()
                  .then((newToken) => {
                    operation.setContext(({headers = {}}) => ({
                      headers: {
                        ...headers,
                        Authorization: newToken ? `Bearer ${newToken}` : "",
                      },
                    }));

                    // Forward the operation and connect it to our observer
                    const subscription = forward(operation).subscribe({
                      next: observer.next.bind(observer),
                      error: observer.error.bind(observer),
                      complete: observer.complete.bind(observer),
                    });

                    // Return cleanup function
                    return () => subscription.unsubscribe();
                  })
                  .catch((error) => {
                    observer.error(error);
                  });
              });
            }
          }
        }

        if (networkError) {
          console.error(`[Network error]: ${networkError}`);
        }
      }
    );

    // Create WebSocket connection
    const wsLink = this.createWsLink();

    // Split connection based on operation type
    const splitLink =
      typeof window !== "undefined" && wsLink
        ? split(
          ({query}) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            );
          },
          wsLink,
          from([errorLink, authLink, httpLink])
        )
        : from([errorLink, authLink, httpLink]);

    // Create Apollo client
    return new ApolloClient({
      link: splitLink,
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: "network-only",
        },
        watchQuery: {
          fetchPolicy: "network-only",
        },
      },
    });
  }

  // Create WebSocket connection
  private createWsLink(): GraphQLWsLink | null {
    if (typeof window === "undefined") return null;

    // Create WebSocket client
    this.wsClient = createClient({
      url: process.env.NEXT_PUBLIC_GRAPHQL_WS_URL || "ws://localhost:8080/v1/graphql",
      connectionParams: async () => {
        const token = await this.tokenManager.getToken();
        return {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        };
      },
      retryAttempts: 5,
      retryWait: (retries) =>
        new Promise((resolve) =>
          setTimeout(resolve, Math.min(1000 * 2 ** retries, 30000))
        ),
      on: {
        error: (error) => {
          console.warn("WebSocket connection error", error);

          // Handle authentication errors
          if (
            typeof error === "object" &&
            error !== null &&
            "message" in error &&
            typeof error.message === "string" &&
            (error.message.toLowerCase().includes("unauthorized") ||
              error.message.toLowerCase().includes("authentication"))
          ) {
            this.tokenManager.refreshToken().catch(console.error);
          }
        },
        connected: () => {
          console.log("WebSocket connected");
        },
        closed: () => {
          console.log("WebSocket connection closed");
        },
      },
    });

    return new GraphQLWsLink(this.wsClient);
  }
}

// Export singleton instance
export const apolloManager = ApolloClientManager.getInstance();

// Get Apollo client
export function getApolloClient() {
  return apolloManager.getClient();
}

// Set current user
export function setCurrentUser(user: UserContext) {
  apolloManager.setUser(user);
}

// User logout
export function ApolloLogout() {
  apolloManager.logout();
}

// React Hook for getting Apollo client
export function useApolloClient() {
  const [client, setClient] = useState(getApolloClient());

  useEffect(() => {
    // Listen for TokenManager changes
    return TokenManager.getInstance().addChangeListener(() => {
      // Update client reference when user changes
      setClient(getApolloClient());
    });
  }, []);

  return client;
}