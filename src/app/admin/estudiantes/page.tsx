import { requireProfile } from "@/lib/auth/session";
import { createServerSupabase } from "@/lib/supabase/server";
import { StudentForm } from "@/components/auth/student-form";
export default async function Students() {
  await requireProfile("teacher");
  const db = await createServerSupabase();
  const { data, error } = await db
    .from("profiles")
    .select("id,full_name,active,created_at")
    .eq("role", "student")
    .order("created_at", { ascending: false })
    .limit(200);
  return (
    <>
      <StudentForm enabled={Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)} />
      <section className="dashboard-module">
        <h2>Estudiantes registrados</h2>
        <p className="auth-hint">
          Hasta 200 registros recientes. La asignación a grupos se habilitará
          junto con la administración académica.
        </p>
        {error ? (
          <p className="auth-error" role="alert">
            No se pudieron consultar los perfiles. Comprueba la migración y la
            conexión.
          </p>
        ) : data?.length ? (
          <ul className="account-list">
            {data.map((p) => (
              <li key={p.id}>
                <strong>{p.full_name}</strong>
                <span>{p.active ? "Acceso activo" : "Acceso desactivado"}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay estudiantes registrados.</p>
        )}
      </section>
    </>
  );
}
