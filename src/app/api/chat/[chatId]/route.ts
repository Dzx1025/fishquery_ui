import {NextRequest, NextResponse} from "next/server";


// The correct type for the params in App Router
export async function POST(
  request: NextRequest,
  {params}: { params: { chatId: string } }
) {
  const {chatId} = await params;

  try {
    // Pass through the cookies from the client request
    const cookieHeader = request.headers.get("cookie") || "";

    // Get the message content from the request body
    const body = await request.json();
    const message = body.message;

    if (!message) {
      return NextResponse.json({error: "Message is required"}, {status: 400});
    }

    // Create headers for the API request
    const headers = new Headers({
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    });

    // Forward the request to the Django backend
    const apiResponse = await fetch(
      `${process.env.DJANGO_API_URL}/api/chat/${chatId}/`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({message}),
        credentials: "include",
      }
    );

    // Handle non-OK responses
    if (!apiResponse.ok) {
      return NextResponse.json(
        {error: `Backend server responded with status ${apiResponse.status}`},
        {status: apiResponse.status}
      );
    }

    // Create a readable stream from the response body
    const reader = apiResponse.body?.getReader();

    if (!reader) {
      return NextResponse.json(
        {error: "Failed to read response stream"},
        {status: 500}
      );
    }

    // Create a stream to send the SSE response back to the client
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const {done, value} = await reader.read();

            if (done) {
              controller.close();
              break;
            }

            // Forward the SSE chunk to the client
            controller.enqueue(value);
          }
        } catch (error) {
          console.error("Stream reading error:", error);
          controller.error(error);
        }
      },
    });

    // Set up headers for SSE response
    const responseHeaders = new Headers({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    // Add all the Set-Cookie headers from the Django response
    const setCookieHeader = apiResponse.headers.get("Set-Cookie");
    if (setCookieHeader) {
      // Split multiple cookies if they exist
      const cookies = setCookieHeader.split(",").map((c) => c.trim());
      cookies.forEach((cookie) => {
        responseHeaders.append("Set-Cookie", cookie);
      });
    }

    return new Response(stream, {
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      {error: "Failed to connect to backend service"},
      {status: 500}
    );
  }
}