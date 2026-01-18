import type {
  LoginResponse,
  RegisterResponse,
  ProfileResponse,
  AuthResponse,
} from "@/types/auth";

/**
 * Base fetch wrapper for auth endpoints with credentials
 */
const authFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  return fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/auth${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Required for cookies
  });
};

/**
 * Login with email and password
 */
export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const res = await authFetch("/login/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

/**
 * Register a new account
 */
export const register = async (
  email: string,
  username: string,
  password: string,
): Promise<RegisterResponse> => {
  const res = await authFetch("/register/", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  });
  return res.json();
};

/**
 * Logout and blacklist token
 */
export const logout = async (): Promise<AuthResponse> => {
  const res = await authFetch("/logout/", {
    method: "POST",
  });
  return res.json();
};

/**
 * Refresh access token
 * Returns error response silently for unauthenticated users
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const res = await authFetch("/token/refresh/", {
      method: "POST",
    });
    return res.json();
  } catch {
    // Return a structured error response instead of throwing
    return {
      status: "error",
      code: 400,
      message: "No refresh token",
      data: null,
      errors: null,
    };
  }
};

/**
 * Get user profile
 * Returns error response silently for unauthenticated users
 */
export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const res = await authFetch("/profile/");
    return res.json();
  } catch {
    // Return a structured error response instead of throwing
    return {
      status: "error",
      code: 401,
      message: "Not authenticated",
      data: null,
      errors: null,
    };
  }
};

/**
 * Update username
 */
export const updateUsername = async (
  username: string,
): Promise<ProfileResponse> => {
  const res = await authFetch("/profile/", {
    method: "PATCH",
    body: JSON.stringify({ username }),
  });
  return res.json();
};
