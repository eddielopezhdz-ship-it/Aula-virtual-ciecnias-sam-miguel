import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicConfig } from "./config";
export async function createServerSupabase() {
  const config = publicConfig();
  const jar = await cookies();
  return createServerClient(config.url, config.key, {
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) =>
            jar.set(name, value, options),
          );
        } catch {
          /* Cookies are refreshed by proxy.ts when rendering a Server Component. */
        }
      },
    },
  });
}
