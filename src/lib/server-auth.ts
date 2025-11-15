import {cookies} from "next/headers";
import {ApiResponse, UserProfile} from "@/services/authTypes";

/**
 * Check if the current request is authenticated by verifying cookies with the backend
 */
export async function getAuthStatus(): Promise<{ isAuthenticated: boolean, user: UserProfile | null }> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Create cookie header string
  const cookieHeader = allCookies.map((cookie) => `${cookie.name}=${cookie.value}`).join("; ");

  if (!cookieHeader) {
    return {isAuthenticated: false, user: null};
  }

  try {
    const response = await fetch(
      `${process.env.DJANGO_API_URL}/api/auth/profile/`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
        },
        credentials: "include",
        cache: "no-store", // Disable caching to always get fresh data
      }
    );

    if (!response.ok) {
      return {isAuthenticated: false, user: null};
    }

    const data: ApiResponse<UserProfile> = await response.json();

    if (data.status === "success" && data.data) {
      return {
        isAuthenticated: true,
        user: data.data,
      };
    }

    return {isAuthenticated: false, user: null};
  } catch (error) {
    console.error("Authentication check failed:", error);
    return {isAuthenticated: false, user: null};
  }
}

