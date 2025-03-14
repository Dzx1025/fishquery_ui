import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { ApiResponse, UserProfile } from "@/lib/types";

/**
 * Check if the current request is authenticated by verifying cookies with the backend
 */
export async function getAuthStatus(): Promise<{
  isAuthenticated: boolean;
  user: UserProfile | null;
}> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // Create cookie header string
  const cookieHeader = allCookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  if (!cookieHeader) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const response = await fetch(
      `${process.env.DJANGO_API_URL}/api/auth/profile`,
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
      return { isAuthenticated: false, user: null };
    }

    const data: ApiResponse<UserProfile> = await response.json();

    if (data.status === "success" && data.data) {
      return {
        isAuthenticated: true,
        user: data.data,
      };
    }

    return { isAuthenticated: false, user: null };
  } catch (error) {
    console.error("Authentication check failed:", error);
    return { isAuthenticated: false, user: null };
  }
}

/**
 * Server action to validate authentication
 * Can be used in Server Components and Route Handlers
 */
export async function validateAuth(request?: NextRequest) {
  let cookieHeader = "";

  if (request) {
    // Use cookies from request if provided (for middleware or route handlers)
    cookieHeader = request.headers.get("cookie") || "";
  } else {
    // Use cookies from the cookie store (for server components)
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    cookieHeader = allCookies
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
  }

  if (!cookieHeader) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const response = await fetch(
      `${process.env.DJANGO_API_URL}/api/auth/profile`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return { isAuthenticated: false, user: null };
    }

    const data: ApiResponse<UserProfile> = await response.json();

    if (data.status === "success" && data.data) {
      return {
        isAuthenticated: true,
        user: data.data,
      };
    }

    return { isAuthenticated: false, user: null };
  } catch (error) {
    console.error("Authentication validation failed:", error);
    return { isAuthenticated: false, user: null };
  }
}
