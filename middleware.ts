import { NextRequest, NextResponse } from "next/server";

function hasAdminSession(request: NextRequest) {
  return [
    "authjs.session-token",
    "__Secure-authjs.session-token",
    "next-auth.session-token",
    "__Secure-next-auth.session-token"
  ].some((cookieName) => Boolean(request.cookies.get(cookieName)?.value));
}

export default function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = nextUrl.pathname === "/admin/login";

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (!hasAdminSession(request) && !isLoginRoute) {
    const loginUrl = new URL("/admin/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasAdminSession(request) && isLoginRoute) {
    return NextResponse.redirect(new URL("/admin", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
