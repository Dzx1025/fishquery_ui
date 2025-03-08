import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/auth/register/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      }
    );

    const data = await response.json();

    // Return the response from Django
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Internal server error",
        data: null,
        errors: ["Failed to process registration request"],
      },
      { status: 500 }
    );
  }
}
