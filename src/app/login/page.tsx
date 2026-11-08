import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/shell";
import { LoginForm } from "@/components/auth/login-form";
import { authConfigured } from "@/lib/supabase/config";
import { getProfile } from "@/lib/auth/session";
import { destination } from "@/lib/auth/validation";
export const dynamic = "force-dynamic";
export default async function Login() {
  const profile = await getProfile();
  if (profile?.active) redirect(destination(profile.role));
  const configured = authConfigured();
  return (
    <PageShell>
      <div className="auth-card">
        <span className="eyebrow">TU CURIOSIDAD TIENE UN LUGAR AQUÍ</span>
        <h1>Qué bueno verte.</h1>
        <p>
          Ingresa al Aula Virtual de Ciencias Naturales de la Institución
          Educativa San Miguel.
        </p>
        {!configured && (
          <div className="auth-notice" role="status">
            Conexión pendiente con Supabase. El formulario se habilitará cuando
            el administrador configure el servicio.
          </div>
        )}
        <LoginForm configured={configured} />
        <Link href="/" className="text-link">
          ← Volver al inicio
        </Link>
      </div>
    </PageShell>
  );
}
