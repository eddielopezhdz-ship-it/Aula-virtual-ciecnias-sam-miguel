import { requireProfile } from "@/lib/auth/session";
import { ModuleCards } from "@/components/auth/dashboard";
export default async function Admin() {
  await requireProfile("teacher");
  return (
    <>
      <div className="auth-notice">
        Etapa 2 · Acceso privado y cuentas. Los módulos académicos continúan
        pendientes.
      </div>
      <ModuleCards teacher />
    </>
  );
}
