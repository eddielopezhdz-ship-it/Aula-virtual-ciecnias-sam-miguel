import Link from "next/link";
import { Sprout, ArrowLeft } from "lucide-react";
import { PageShell } from "./shell";
import { PageHeading } from "./page-heading";
export function ComingSoon({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description: string;
}) {
  return (
    <PageShell>
      <PageHeading label={label} title={title} description={description} />
      <div className="container page-content">
        <div className="coming-soon">
          <span className="subject-icon">
            <Sprout size={30} />
          </span>
          <h2>Estamos sembrando nuevas ideas.</h2>
          <p>
            Esta sección se habilitará en una próxima etapa. Por ahora puedes
            conocer nuestra propuesta educativa en la página principal.
          </p>
          <span className="tag">Etapa 1 · Estructura y diseño</span>
          <Link href="/" className="button">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
