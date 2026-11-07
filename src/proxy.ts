import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const basicAuth = request.headers.get("authorization");

  if (basicAuth) {
    const [, encoded] = basicAuth.split(" ");
    const [, password] = atob(encoded).split(":");

    if (password === process.env.ADMIN_PASSWORD) {
      return NextResponse.next();
    }
  }

  return new Response("Autenticação necessária", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="admin"' },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
