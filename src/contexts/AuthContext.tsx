'use client';

import React, {createContext, useContext, useState, useEffect, useCallback, useRef} from 'react';

interface AuthTokens {
    access: string;
    refresh: string;
}

interface DecodedToken {
    token_type: string;
    exp: number;
    iat: number;
    jti: string;
    user_id: number;
    'https://hasura.io/jwt/claims': {
        'x-hasura-allowed-roles': string[];
        'x-hasura-default-role': string;
        'x-hasura-user-id': string;
        'x-hasura-user-email': string;
        'x-hasura-is-staff': string;
    };
    email: string;
    username: string;
    is_staff: boolean;
}

interface AuthContextType {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    getAccessToken: () => string | null;
    refreshAccessToken: () => Promise<boolean>;
    getUserId: () => number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DJANGO_API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL;

const decodeToken = (token: string): DecodedToken | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

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

        const decoded = decodeToken(tokens.access);
        if (decoded?.user_id) {
            localStorage.setItem('userId', decoded.user_id.toString());
        }
    };

    const clearTokens = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userId');
        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
            refreshTimerRef.current = null;
        }
    }, []);

    const setupRefreshTimer = useCallback((token: string) => {
        const decoded = decodeToken(token);
        if (!decoded) return;

        const expiresIn = decoded.exp * 1000 - Date.now();
        const refreshTime = Math.max(0, expiresIn - 60000);

        if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
        }

        refreshTimerRef.current = setTimeout(async () => {
            await refreshAccessToken();
        }, refreshTime);
    }, []);

    const refreshAccessToken = async (): Promise<boolean> => {
        const tokens = getStoredTokens();
        if (!tokens?.refresh) return false;

        try {
            const response = await fetch(`${DJANGO_API_URL}/api/token/refresh/`, {
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
                    refresh: tokens.refresh,
                });
                setupRefreshTimer(newTokens.access);
                return true;
            }

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
            const response = await fetch(`${DJANGO_API_URL}/api/token/`, {
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
                setupRefreshTimer(tokens.access);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = useCallback(() => {
        clearTokens();
        setIsAuthenticated(false);
    }, [clearTokens]);

    const getAccessToken = (): string | null => {
        const tokens = getStoredTokens();
        return tokens?.access || null;
    };

    const getUserId = (): number | null => {
        const storedId = localStorage.getItem('userId');
        return storedId ? parseInt(storedId, 10) : null;
    };

    useEffect(() => {
        const initAuth = async () => {
            const tokens = getStoredTokens();
            if (!tokens?.access) {
                setIsAuthenticated(false);
                return;
            }

            const decoded = decodeToken(tokens.access);
            if (!decoded) {
                clearTokens();
                setIsAuthenticated(false);
                return;
            }

            const isExpired = decoded.exp * 1000 < Date.now();
            if (!isExpired) {
                setupRefreshTimer(tokens.access);
                setIsAuthenticated(true);
            } else {
                const refreshSuccess = await refreshAccessToken();
                if (!refreshSuccess) {
                    clearTokens();
                    setIsAuthenticated(false);
                }
            }
        };

        initAuth();

        return () => {
            if (refreshTimerRef.current) {
                clearTimeout(refreshTimerRef.current);
            }
        };
    }, [clearTokens, setupRefreshTimer]);

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout,
                getAccessToken,
                refreshAccessToken,
                getUserId
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
