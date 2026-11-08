import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { authConfigured, publicConfig } from "./config";
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const privatePath =
    request.nextUrl.pathname === "/admin" ||
    request.nextUrl.pathname.startsWith("/admin/") ||
    request.nextUrl.pathname === "/aula" ||
    request.nextUrl.pathname.startsWith("/aula/");
  if (!authConfigured())
    return privatePath
      ? NextResponse.redirect(new URL("/login", request.url))
      : response;
  const config = publicConfig();
  const db = createServerClient(config.url, config.key, {
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (values) => {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        values.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });
  // Never trust an unverified getSession() user for authorization.
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (privatePath && (error || !user)) {
    const redirect = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
