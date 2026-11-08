import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Export the existing stage-one pages without requiring a Node.js server.
const output = ".next/server/app";
const routeFiles = {
  "/": "index.html",
  "/asignaturas": "asignaturas.html",
  "/biblioteca": "biblioteca.html",
  "/programacion": "programacion.html",
  "/evaluaciones": "evaluaciones.html",
  "/login": "biblioteca.html",
};
const clean = (html) =>
  html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<link\b[^>]*>/gi, "")
    .replace(/<!--.*?-->/gs, "")
    .replace(/<template[^>]*><\/template>/g, "")
    .replace(/<div class="loading"[^>]*>[\s\S]*?<\/div>/g, "")
    .replace(/<div hidden id="S:[^"]*">/g, "<div>")
    .replace(
      /href="\/(asignaturas|biblioteca|programacion|evaluaciones|login)?"/g,
      (_, route) => `href="#/${route || ""}"`,
    );
const pages = {};
let home;
for (const [route, file] of Object.entries(routeFiles)) {
  let html = clean(await readFile(path.join(output, file), "utf8"));
  // Authentication requires the Next.js server. Never export a working-looking
  // login form into a standalone file.
  if (route === "/login") {
    html = html
      .replaceAll(
        "Tu biblioteca de descubrimientos.",
        "Acceso disponible en la aplicación conectada.",
      )
      .replaceAll("BIBLIOTECA DIGITAL", "ACCESO PRIVADO")
      .replaceAll(
        "Aquí encontrarás guías, infografías, lecturas y materiales publicados por tu docente.",
        "Esta copia independiente no admite sesiones. Inicia la aplicación Next.js con Supabase para ingresar.",
      )
      .replaceAll(
        "Esta sección se habilitará en una próxima etapa. Por ahora puedes conocer nuestra propuesta educativa en la página principal.",
        "El acceso con cuentas está implementado en la aplicación Next.js y requiere un proyecto Supabase configurado. Este archivo es solo una presentación sin conexión.",
      );
  }
  pages[route] = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1];
  if (route === "/") home = html;
}
const original = await readFile(path.join(output, "index.html"), "utf8");
const cssPaths = [
  ...original.matchAll(/<link[^>]*href="([^"]+\.css)"[^>]*>/g),
].map((match) => match[1]);
let css = "";
for (const file of cssPaths)
  css += await readFile(
    path.join(".next", file.replace("/_next/", "")),
    "utf8",
  );
const data = JSON.stringify(pages).replace(/</g, "\\u003c");
const navigation = `<script>
const pages = ${data};
function renderPage() {
  const route = location.hash.slice(1) || '/';
  if (!route.startsWith('/')) return;
  document.body.innerHTML = pages[route] || pages['/'];
  window.scrollTo(0, 0);
  const heading = document.querySelector('h1');
  document.title = (route === '/' ? 'Aula Virtual de Ciencias Naturales' : heading.textContent) + ' · San Miguel';
  if (route !== '/') { heading.tabIndex = -1; heading.focus({preventScroll: true}); }
}
window.addEventListener('hashchange', renderPage);
if (location.hash.startsWith('#/')) renderPage();
</script>`;
const result = home
  .replace("</head>", `<style>${css}</style></head>`)
  .replace("</body>", `${navigation}</body>`);
await writeFile(process.env.INDEX_OUTPUT || "index.html", result);
console.log(
  "index.html generado: portada y cinco secciones, sin dependencias externas.",
);
