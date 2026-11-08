import { createClient } from "@supabase/supabase-js";
const [userId, ...nameParts] = process.argv.slice(2);
const fullName = nameParts.join(" ").trim();
if (
  !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    userId ?? "",
  ) ||
  fullName.length < 3 ||
  fullName.length > 100
) {
  console.error(
    'Uso: node --env-file=.env.local scripts/bootstrap-admin.mjs UUID_AUTH "Nombre del docente"',
  );
  process.exit(1);
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
  key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Configura las variables seguras antes de continuar.");
  process.exit(1);
}
const db = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { error } = await db.rpc("bootstrap_teacher", {
  p_user_id: userId,
  p_full_name: fullName,
});
if (error) {
  console.error(
    "No se pudo inicializar el administrador. Verifica la migración, que el usuario esté confirmado y que no exista ya un docente.",
  );
  process.exit(1);
}
console.log(
  "Administrador inicial creado. Ya puede iniciar sesión con su cuenta de Supabase Auth.",
);
