import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Aula Virtual · Ciencias Naturales",
    template: "%s · San Miguel",
  },
  description:
    "Un espacio para explorar, comprender y descubrir la ciencia. Institución Educativa San Miguel, Aguachica, Cesar.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CO">
      <body>{children}</body>
    </html>
  );
}
