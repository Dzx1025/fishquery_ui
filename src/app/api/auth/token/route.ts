import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// This is a server-side API route that helps extract the token from HTTP-only cookies
// This is used for WebSocket connections which can't directly access HTTP-only cookies
export async function GET() {
  try {
    // Get the JWT cookie
    const cookieStore = await cookies();
    const jwtCookie = cookieStore.get("access_token");

    if (!jwtCookie) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // You might want to verify the JWT here to make sure it's valid
    // const decoded = verify(jwtCookie.value, process.env.JWT_SECRET);

    // Return just the token for WebSocket connection
    return NextResponse.json({ token: jwtCookie.value });
  } catch (error) {
    console.error("Error extracting token:", error);
    return NextResponse.json(
      { error: "Authentication error" },
      { status: 401 }
    );
  }
}
