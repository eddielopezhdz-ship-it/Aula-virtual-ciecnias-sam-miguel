import Link from "next/link";
import {
  BookOpen,
  Users,
  Layers,
  LibraryBig,
  ClipboardList,
  FlaskConical,
  ChartNoAxesCombined,
  ArrowUpRight,
} from "lucide-react";
import { PageShell } from "@/components/shell";
import { PageHeading } from "@/components/page-heading";
import { signOut } from "@/app/login/actions";
import type { Profile } from "@/lib/auth/validation";
export const teacherModules = [
  {
    slug: "estudiantes",
    title: "Estudiantes",
    description:
      "Crea cuentas individuales y consulta los perfiles registrados.",
    icon: Users,
    ready: true,
  },
  {
    slug: "grupos",
    title: "Grados y grupos",
    description: "Organización de grados y grupos. Próxima etapa.",
    icon: Layers,
  },
  {
    slug: "asignaturas",
    title: "Asignaturas y periodos",
    description: "Organización académica y programación. Próxima etapa.",
    icon: BookOpen,
  },
  {
    slug: "biblioteca",
    title: "Biblioteca digital",
    description: "Materiales y archivos educativos. Próxima etapa.",
    icon: LibraryBig,
  },
  {
    slug: "actividades",
    title: "Actividades y talleres",
    description: "Actividades, entregas y retroalimentación. Próxima etapa.",
    icon: ClipboardList,
  },
  {
    slug: "evaluaciones",
    title: "Evaluaciones",
    description: "Preguntas, intentos y pruebas. Próxima etapa.",
    icon: FlaskConical,
  },
  {
    slug: "calificaciones",
    title: "Calificaciones",
    description: "Resultados y seguimiento. Próxima etapa.",
    icon: ChartNoAxesCombined,
  },
];
export const studentModules = [
  {
    slug: "asignaturas",
    title: "Mis asignaturas",
    description: "Las asignaturas de tus grupos aparecerán aquí.",
    icon: BookOpen,
  },
  {
    slug: "materiales",
    title: "Mis materiales",
    description: "Guías y recursos publicados para ti.",
    icon: LibraryBig,
  },
  {
    slug: "actividades",
    title: "Mis actividades",
    description: "Talleres y actividades de aprendizaje.",
    icon: ClipboardList,
  },
];
export function DashboardShell({
  profile,
  children,
}: {
  profile: Profile;
  children: React.ReactNode;
}) {
  const teacher = profile.role === "teacher",
    base = teacher ? "/admin" : "/aula",
    modules = teacher ? teacherModules : studentModules;
  return (
    <PageShell>
      <PageHeading
        label={teacher ? "PANEL DEL DOCENTE" : "MI AULA"}
        title={`Hola, ${profile.full_name.split(" ")[0]}.`}
        description={
          teacher
            ? "Tu espacio para acompañar el aprendizaje."
            : "Cada pregunta es una oportunidad para descubrir."
        }
      />
      <div className="container dashboard">
        <aside className="dashboard-nav">
          <Link href={base}>Inicio del panel</Link>
          {modules.map((m) => (
            <Link key={m.slug} href={`${base}/${m.slug}`}>
              {m.title}
            </Link>
          ))}
          <form action={signOut}>
            <button className="button secondary">Cerrar sesión</button>
          </form>
        </aside>
        <div className="dashboard-content">{children}</div>
      </div>
    </PageShell>
  );
}
export function ModuleCards({ teacher }: { teacher: boolean }) {
  return (
    <div className="dashboard-grid">
      {(teacher ? teacherModules : studentModules).map((m) => {
        const Icon = m.icon;
        const ready = "ready" in m && m.ready;
        return (
          <Link
            href={`${teacher ? "/admin" : "/aula"}/${m.slug}`}
            className="dashboard-module"
            key={m.slug}
          >
            <Icon size={27} />
            <span className="tag">
              {ready ? "Cuentas disponibles" : "Próxima etapa"}
            </span>
            <h2>{m.title}</h2>
            <p>{m.description}</p>
            <span className="text-link">
              {ready ? "Gestionar estudiantes" : "Ver estado del módulo"}
              <ArrowUpRight size={16} />
            </span>
          </Link>
        );
      })}
    </div>
  );
}
export function PendingModule({ title }: { title: string }) {
  return (
    <section className="dashboard-module">
      <span className="eyebrow">MÓDULO ACADÉMICO PENDIENTE</span>
      <h2>{title}</h2>
      <p>
        Esta sección se implementará en una próxima etapa. Todavía no permite
        crear, guardar ni consultar contenidos académicos.
      </p>
    </section>
  );
}
