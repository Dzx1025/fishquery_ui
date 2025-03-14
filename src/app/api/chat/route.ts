import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    const response = await fetch(`${process.env.DJANGO_API_URL}/api/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify({ message }),
      credentials: "include",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Internal server error",
        data: null,
        errors: ["Failed to fetch profile"],
      },
      { status: 500 }
    );
  }
}
