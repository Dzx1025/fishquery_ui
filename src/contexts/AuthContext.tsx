'use client';

import {createContext, useContext, useState, useEffect} from 'react';

interface AuthTokens {
    access: string;
    refresh: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    getAccessToken: () => string | null;
    refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for existing tokens in localStorage
        const tokens = getStoredTokens();
        setIsAuthenticated(!!tokens?.access);
    }, []);

    const getStoredTokens = (): AuthTokens | null => {
        const access = localStorage.getItem('accessToken');
        const refresh = localStorage.getItem('refreshToken');
        if (access && refresh) {
            return {access, refresh};
        }
        return null;
    };

    const storeTokens = (tokens: AuthTokens) => {
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
    };

    const clearTokens = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    const refreshAccessToken = async (): Promise<boolean> => {
        const tokens = getStoredTokens();
        if (!tokens?.refresh) return false;

        try {
            const response = await fetch('http://localhost:8000/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh: tokens.refresh,
                }),
            });

            if (response.ok) {
                const newTokens = await response.json();
                storeTokens({
                    access: newTokens.access,
                    refresh: tokens.refresh, // Keep existing refresh token
                });
                return true;
            }

            // If refresh failed, clear tokens and log out
            clearTokens();
            setIsAuthenticated(false);
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            clearTokens();
            setIsAuthenticated(false);
            return false;
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('http://localhost:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username, password}),
            });

            if (response.ok) {
                const tokens: AuthTokens = await response.json();
                storeTokens(tokens);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        clearTokens();
        setIsAuthenticated(false);
    };

    const getAccessToken = (): string | null => {
        const tokens = getStoredTokens();
        return tokens?.access || null;
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout,
                getAccessToken,
                refreshAccessToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Custom fetch hook that handles token management
export const useAuthFetch = () => {
    const {getAccessToken, logout, refreshAccessToken} = useAuth();

    const authFetch = async (url: string, options: RequestInit = {}) => {
        const accessToken = getAccessToken();
        if (!accessToken) {
            throw new Error('No access token available');
        }

        const headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        };

        try {
            const response = await fetch(url, {...options, headers});

            // If we get a 401, try to refresh the token
            if (response.status === 401) {
                const refreshSuccessful = await refreshAccessToken();
                if (refreshSuccessful) {
                    // Retry the original request with the new token
                    const newAccessToken = getAccessToken();
                    headers.Authorization = `Bearer ${newAccessToken}`;
                    return fetch(url, {...options, headers});
                } else {
                    logout();
                    throw new Error('Session expired');
                }
            }

            return response;
        } catch (error) {
            console.error('Auth fetch error:', error);
            throw error;
        }
    };

    return authFetch;
};