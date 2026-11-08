import Link from "next/link";
import { ArrowUpRight, MapPin, Menu } from "lucide-react";
import { Brand } from "./brand";
import { NavLinks } from "./nav-links";
export function Header() {
  return (
    <>
      <div className="institution-bar">
        <div className="container">
          <span>Institución Educativa San Miguel</span>
          <span>
            <MapPin size={12} /> Aguachica, Cesar, Colombia
          </span>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Brand />
          <nav aria-label="Navegación principal" className="desktop-nav">
            <NavLinks />
          </nav>
          <Link href="/login" className="button small">
            Ingresar al aula <ArrowUpRight size={15} />
          </Link>
          <details className="mobile-nav">
            <summary aria-label="Abrir menú">
              <Menu />
            </summary>
            <nav aria-label="Navegación móvil">
              <NavLinks />
            </nav>
          </details>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer>
      <div className="container footer-main">
        <div>
          <Brand />
          <p>Aprender ciencias es aprender a cuidar la vida.</p>
        </div>
        <div>
          <strong>Institución Educativa San Miguel</strong>
          <p>Aguachica, Cesar · Colombia</p>
          <p>Ciencias Naturales y Educación Ambiental</p>
        </div>
        <div>
          <strong>Un aula, muchas posibilidades</strong>
          <Link href="/login">
            Acceso para estudiantes y docente <ArrowUpRight size={13} />
          </Link>
          <p>Grados sexto a undécimo</p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} I. E. San Miguel. Todos los derechos
          reservados.
        </span>
        <span>
          Hecho para aprender. Pensado para ti. <LeafIcon />
        </span>
      </div>
    </footer>
  );
}
function LeafIcon() {
  return <span aria-hidden="true">❧</span>;
}
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
    </>
  );
}
