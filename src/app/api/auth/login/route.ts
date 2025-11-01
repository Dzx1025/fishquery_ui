import {NextResponse} from "next/server";
import type {NextRequest} from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {email, password} = await request.json();

    const response = await fetch(
      `${process.env.DJANGO_API_URL}/api/auth/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password}),
      }
    );

    const data = await response.json();

    // Create the Next.js response, forwarding Django's status code
    const nextResponse = NextResponse.json(data, {
      status: response.status,
      statusText: response.statusText,
    });

    // Forward the 'Set-Cookie' headers from Django to the client browser
    const setCookies = response.headers.getSetCookie();
    setCookies.forEach(cookie => {
      nextResponse.headers.append("Set-Cookie", cookie);
    });

    return nextResponse;
  } catch (error: unknown) {
    console.error("Login error:", error);

    // Check if the error is a fetch network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        {
          status: "error",
          code: 503,
          message: "Upstream service error",
          data: null,
          errors: ["Failed to connect to authentication service"],
        },
        {status: 503}
      );
    }

    // Check if the error is from response.json() (e.g., Django returned an HTML error page)
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          status: "error",
          code: 502,
          message: "Invalid response from upstream service",
          data: null,
          errors: ["Failed to parse authentication response"],
        },
        {status: 502}
      );
    }

    // Default internal server error
    return NextResponse.json(
      {
        status: "error",
        code: 500,
        message: "Internal server error",
        data: null,
        errors: ["Failed to process login request"],
      },
      {status: 500}
    );
  }
}