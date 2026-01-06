import type {
    LoginResponse,
    RegisterResponse,
    ProfileResponse,
    AuthResponse,
} from "@/types/auth"

const API_URL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000"

/**
 * Base fetch wrapper for auth endpoints with credentials
 */
const authFetch = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {
    return fetch(`${API_URL}/api/auth${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        credentials: "include", // Required for cookies
    })
}

/**
 * Login with email and password
 */
export const login = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    const res = await authFetch("/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    })
    return res.json()
}

/**
 * Register a new account
 */
export const register = async (
    email: string,
    username: string,
    password: string
): Promise<RegisterResponse> => {
    const res = await authFetch("/register/", {
        method: "POST",
        body: JSON.stringify({ email, username, password }),
    })
    return res.json()
}

/**
 * Logout and blacklist token
 */
export const logout = async (): Promise<AuthResponse> => {
    const res = await authFetch("/logout/", {
        method: "POST",
    })
    return res.json()
}

/**
 * Refresh access token
 */
export const refreshToken = async (): Promise<AuthResponse> => {
    const res = await authFetch("/token/refresh/", {
        method: "POST",
    })
    return res.json()
}

/**
 * Get user profile
 */
export const getProfile = async (): Promise<ProfileResponse> => {
    const res = await authFetch("/profile/")
    return res.json()
}

/**
 * Update username
 */
export const updateUsername = async (
    username: string
): Promise<ProfileResponse> => {
    const res = await authFetch("/profile/", {
        method: "PATCH",
        body: JSON.stringify({ username }),
    })
    return res.json()
}
