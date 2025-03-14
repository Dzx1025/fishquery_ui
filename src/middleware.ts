// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public paths that don't require authentication
const publicPaths = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

// Define paths that need authentication
const protectedPaths = ["/profile", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(
    (path) => pathname.startsWith(path) || pathname === path
  );
  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (path) => pathname.startsWith(path) || pathname === path
  );
  // Check if user has authentication cookie
  const hasCookie = request.cookies.has("access_token");
  // If accessing a protected path without cookie, redirect to login
  if (isProtectedPath && !hasCookie) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  // If accessing a public path with cookie, redirect to dashboard (optional)
  if (isPublicPath && hasCookie) {
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// Configure the paths for which this middleware will run
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
