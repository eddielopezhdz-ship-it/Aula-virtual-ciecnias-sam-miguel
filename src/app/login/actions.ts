"use server";
import { redirect } from "next/navigation";
import {
  loginSchema,
  destination,
  type FormState,
} from "@/lib/auth/validation";
import { authConfigured } from "@/lib/supabase/config";
import { createServerSupabase } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth/session";
export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  if (!authConfigured())
    return {
      error:
        "El acceso aún no está conectado. El administrador debe configurar Supabase siguiendo la guía de instalación.",
    };
  const parsed = loginSchema.safeParse({
    email: form.get("email"),
    password: form.get("password"),
  });
  if (!parsed.success)
    return {
      error:
        "Escribe un correo válido y una contraseña de al menos 8 caracteres.",
    };
  let target: string;
  try {
    const db = await createServerSupabase();
    const { error } = await db.auth.signInWithPassword(parsed.data);
    if (error)
      return {
        error:
          "No fue posible ingresar. Revisa tus credenciales o consulta al docente. Si hiciste varios intentos, espera antes de volver a intentar.",
      };
    const profile = await getProfile();
    if (!profile?.active) {
      await db.auth.signOut({ scope: "local" });
      return {
        error: "Tu cuenta no tiene acceso habilitado. Consulta al docente.",
      };
    }
    target = destination(profile.role);
  } catch {
    return {
      error:
        "No se pudo conectar con el servicio de acceso. Intenta más tarde.",
    };
  }
  redirect(target);
}
export async function signOut() {
  if (authConfigured()) {
    const db = await createServerSupabase();
    const { error } = await db.auth.signOut({ scope: "local" });
    if (error)
      throw new Error("No se pudo cerrar la sesión. Intenta de nuevo.");
  }
  redirect("/login");
}
