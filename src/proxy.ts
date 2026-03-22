import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin")) {
    const token = await getToken({ req: request });

    if (!token) {
      return NextResponse.redirect(
        new URL("/connexion?callbackUrl=" + pathname, request.url)
      );
    }

    if (token.role !== "ADMIN" && token.role !== "STAFF") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
