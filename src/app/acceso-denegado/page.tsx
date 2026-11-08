import Link from "next/link";
import { PageShell } from "@/components/shell";
import { signOut } from "@/app/login/actions";
export default function Denied() {
  return (
    <PageShell>
      <div className="auth-card">
        <span className="eyebrow">ACCESO RESTRINGIDO</span>
        <h1>Esta sección no está disponible para tu cuenta.</h1>
        <p>Si crees que es un error, consulta al docente.</p>
        <Link href="/aula" className="text-link">
          Ir a mi aula →
        </Link>
        <form action={signOut}>
          <button className="button secondary" style={{ marginTop: 20 }}>
            Cerrar sesión
          </button>
        </form>
      </div>
    </PageShell>
  );
}
