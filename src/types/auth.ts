export interface User {
    id: number
    email: string
    username: string
    subscription_type: string
    is_subscription_active: boolean
    daily_message_quota: number
    messages_used_today: number
}

// Base API response structure
export interface ApiResponse<T = unknown> {
    status: "success" | "error"
    code: number
    message: string
    data: T | null
    errors: Record<string, string[]> | null
}

export interface LoginData {
    userid: number
    email: string
}

export interface RegisterData {
    email: string
}

export type LoginResponse = ApiResponse<LoginData>
export type RegisterResponse = ApiResponse<RegisterData>
export type ProfileResponse = ApiResponse<User>
export type AuthResponse = ApiResponse<null>
