import { requireProfile } from "@/lib/auth/session";
import { ModuleCards } from "@/components/auth/dashboard";
export default async function Aula() {
  await requireProfile();
  return (
    <>
      <div className="auth-notice">
        Tu cuenta tiene acceso privado. Las asignaturas, los materiales y las
        actividades se habilitarán en próximas etapas; todavía no hay contenidos
        académicos publicados.
      </div>
      <ModuleCards teacher={false} />
    </>
  );
}
