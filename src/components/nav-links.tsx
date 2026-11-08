"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function NavLinks() {
  const path = usePathname();
  return (
    <>
      {[
        ["/", "Inicio"],
        ["/asignaturas", "Asignaturas"],
        ["/biblioteca", "Biblioteca digital"],
        ["/programacion", "Programación"],
      ].map(([href, label]) => (
        <Link
          key={href}
          href={href}
          className={path === href ? "nav-active" : undefined}
          aria-current={path === href ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </>
  );
}
