import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Session Token
  const token = req.cookies.get("better-auth.session_token")?.value;

  // Protected Routes
  const protectedRoutes = [
    "/post-a-job",
    "/employers/dashboard",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if no session
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/post-a-job/:path*",
    "/employers/dashboard/:path*",
  ],
};