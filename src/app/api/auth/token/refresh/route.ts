import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Call Django token refresh endpoint
    const response = await fetch(
      `${process.env.DJANGO_API_URL}/api/auth/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: request.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );

    const data = await response.json();

    // Create a new response based on the API response
    const nextResponse = NextResponse.json(data);

    // Forward cookies from the backend
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        nextResponse.headers.append("Set-Cookie", value);
      }
    });

    return nextResponse;
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Internal server error",
        data: null,
        errors: ["Failed to refresh token"],
      },
      { status: 500 }
    );
  }
}
