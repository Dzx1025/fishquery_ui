import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Call Django logout endpoint
    const response = await fetch(
      `${process.env.DJANGO_API_URL}/api/auth/logout/`,
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

    // Forward cookies from the backend (to clear them)
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        nextResponse.headers.append("Set-Cookie", value);
      }
    });

    return nextResponse;
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Internal server error",
        data: null,
        errors: ["Failed to process logout request"],
      },
      { status: 500 }
    );
  }
}
