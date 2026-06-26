import { NextRequest, NextResponse } from "next/server";

// Decode JWT payload without verifying signature (Edge runtime safe).
// Real verification still happens server-side on every API call.
function decodeToken(token: string): { sub?: string; role?: string } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

const USER_PROTECTED = ["/cart", "/orders", "/account"];
const ADMIN_PREFIX = "/gestion";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Block old /admin path — returns 404 to not reveal the new path
  if (pathname.startsWith("/admin")) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  // Admin routes: token required + role must be ADMIN
  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    const payload = decodeToken(token);
    if (!payload || payload.role !== "ADMIN") {
      // Redirect to home without revealing that /gestion exists
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Regular protected routes: token required
  const isUserProtected = USER_PROTECTED.some((p) => pathname.startsWith(p));
  if (isUserProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/gestion/:path*",
    "/cart/:path*",
    "/orders/:path*",
    "/account/:path*",
  ],
};
