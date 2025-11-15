import {ApiResponse, LoginCredentials, RegisterCredentials, UserProfile} from "@/services/authTypes";

class AuthService {
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ userid: number, email: string }>> {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });

    return await response.json();
  }

  async register(data: RegisterCredentials): Promise<ApiResponse> {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    return await response.json();
  }

  async refreshToken(): Promise<ApiResponse> {
    const response = await fetch("/api/auth/token/refresh", {
      method: "POST",
      credentials: "include",
    });

    return await response.json();
  }

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await fetch("/api/auth/profile", {
      method: "GET",
      credentials: "include",
    });

    return await response.json();
  }

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    const response = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    return await response.json();
  }
}

// Create a singleton instance
const authService = new AuthService();
export default authService;
