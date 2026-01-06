"use client"

import * as React from "react"
import type { User } from "@/types/auth"
import { getProfile, login as apiLogin, logout as apiLogout, refreshToken } from "@/lib/auth"

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
    checkAuth: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null)
    const [loading, setLoading] = React.useState(true)

    // Check auth status on mount
    React.useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            let res = await getProfile()

            // If access token is expired/missing, try to refresh
            if (res.status === "error" && res.code === 401) {
                const refreshRes = await refreshToken()
                if (refreshRes.status === "success") {
                    // Retry getProfile after successful refresh
                    res = await getProfile()
                }
            }

            if (res.status === "success" && res.data) {
                setUser(res.data)
            } else {
                setUser(null)
            }
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const res = await apiLogin(email, password)
            if (res.status === "success") {
                // Fetch full profile after login
                const profileRes = await getProfile()
                if (profileRes.status === "success" && profileRes.data) {
                    setUser(profileRes.data)
                }
                return { success: true }
            }
            return { success: false, error: res.message || "Login failed" }
        } catch {
            return { success: false, error: "Network error. Please try again." }
        }
    }

    const logout = async () => {
        try {
            await apiLogout()
        } catch {
            // Ignore errors, clear user anyway
        }
        setUser(null)
    }

    const refreshUser = async () => {
        try {
            // First try to refresh the token
            const refreshRes = await refreshToken()
            if (refreshRes.status === "success") {
                // Then fetch updated profile
                const profileRes = await getProfile()
                if (profileRes.status === "success" && profileRes.data) {
                    setUser(profileRes.data)
                }
            }
        } catch {
            // If refresh fails, user will need to login again
            setUser(null)
        }
    }

    const value = React.useMemo(
        () => ({
            user,
            loading,
            login,
            logout,
            refreshUser,
            checkAuth,
        }),
        [user, loading]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = React.useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
