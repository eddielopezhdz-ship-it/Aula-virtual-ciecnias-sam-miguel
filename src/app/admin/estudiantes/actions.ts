"use server";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { getProfile } from "@/lib/auth/session";
import { canAccess, type FormState } from "@/lib/auth/validation";
import { provisionStudent } from "@/lib/auth/accounts";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminSupabase } from "@/lib/supabase/admin";
export async function createStudent(
  _: FormState,
  form: FormData,
): Promise<FormState> {
  try {
    const actor = await getProfile();
    if (!canAccess(actor, "teacher")) return { error: "Acceso no autorizado." };
    const db = await createServerSupabase();
    const admin = createAdminSupabase();
    const credentials = await provisionStudent(
      actor,
      { email: form.get("email"), fullName: form.get("fullName") },
      {
        reserve: async () => {
          const { error } = await db.rpc("reserve_student_creation");
          if (error)
            throw new Error(
              "No se puede crear otra cuenta ahora. Revisa la migración o espera antes de volver a intentar.",
            );
        },
        create: async (email, password) => {
          const { data, error } = await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
          });
          if (error || !data.user)
            throw new Error(
              "No fue posible crear la cuenta. Comprueba que el correo no esté registrado.",
            );
          return data.user.id;
        },
        saveProfile: async (id, fullName) => {
          const { error } = await db
            .from("profiles")
            .insert({ id, full_name: fullName, role: "student", active: true });
          if (error) throw new Error("No se pudo guardar el perfil.");
        },
        remove: async (id) => {
          const { error } = await admin.auth.admin.deleteUser(id);
          if (error) throw error;
        },
      },
      () => randomBytes(18).toString("base64url"),
    );
    revalidatePath("/admin/estudiantes");
    return {
      success:
        "Cuenta creada. Entrega estas credenciales de forma privada; la contraseña se muestra solo en esta respuesta.",
      credentials,
    };
  } catch (error) {
    const known = error instanceof Error ? error.message : "";
    const allowed = [
      "La cuenta quedó sin perfil. Debe revisarse en Supabase Auth antes de volver a crearla.",
      "No se pudo crear el perfil. La cuenta incompleta fue retirada.",
      "No fue posible crear la cuenta. Comprueba que el correo no esté registrado.",
      "No se puede crear otra cuenta ahora. Revisa la migración o espera antes de volver a intentar.",
      "La creación de cuentas no está configurada en el servidor.",
    ];
    return {
      error: allowed.includes(known)
        ? known
        : "No se pudo registrar al estudiante. Revisa los campos y la conexión.",
    };
  }
}
