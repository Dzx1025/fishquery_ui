import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    // Request Django API authentication endpoint
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/auth/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Send cookies with the request
      }
    );

    const data = await response.json();

    const nextResponse = NextResponse.json(data);

    // Forward cookies from the backend
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        nextResponse.headers.append("Set-Cookie", value);
      }
    });

    return nextResponse;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Internal server error",
        data: null,
        errors: ["Failed to process login request"],
      },
      { status: 500 }
    );
  }
}
