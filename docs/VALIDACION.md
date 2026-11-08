# Verificación de la etapa 1

Comprobaciones ejecutadas sobre la aplicación de producción en este entorno:

| Comprobación                                                 | Resultado                                |
| ------------------------------------------------------------ | ---------------------------------------- |
| Instalación reproducible con `npm ci`                        | Correcta                                 |
| `npm run build`                                              | Correcta; rutas públicas prerenderizadas |
| `npm run typecheck`                                          | Sin errores                              |
| `npm run format:check`                                       | Correcta                                 |
| `git diff --check`                                           | Sin errores de espacios                  |
| Arranque con `npm start`                                     | Correcto                                 |
| Portada en Chromium a 1440, 768, 390 y 320 px                | Sin desbordamiento horizontal            |
| Menú móvil: abrir y navegar a biblioteca                     | Correcto                                 |
| Asignaturas, biblioteca, programación, evaluaciones y acceso | HTTP 200, con aviso de etapa futura      |
| Dirección inexistente                                        | HTTP 404 y regreso al inicio funcional   |
| Errores de JavaScript durante navegación                     | Ninguno observado                        |

Se revisaron capturas completas de escritorio y celular. Se incluyeron enlace para saltar al contenido, idioma español, regiones semánticas, foco visible, menú operable por teclado y adaptación a movimiento reducido. Esto no equivale a una auditoría completa WCAG ni a pruebas en dispositivos iOS o Android físicos.

La primera compilación dentro del sandbox falló porque Turbopack necesita abrir un puerto local para procesar PostCSS. Con la capacidad de ejecución local autorizada, la compilación terminó correctamente. La prueba inicial de tableta detectó un desbordamiento en las secciones del docente y la invitación de acceso; se corrigieron sus anchos y se repitió la prueba en las cuatro resoluciones con resultado satisfactorio.

No se ejecutaron pruebas de autenticación, permisos, carga de archivos, calificaciones ni Supabase: esas funciones no pertenecen a esta etapa y no están implementadas. No hay despliegue remoto verificado.

## Index independiente

Se generó `index.html` con estilos e ilustraciones incluidos y navegación entre las secciones informativas mediante fragmentos de URL. Chromium del entorno bloqueó la apertura de direcciones `file://`; la comprobación se realizó sirviendo el mismo archivo mediante un servidor HTTP local temporal, sin Next.js. Se probaron el menú móvil, biblioteca, regreso al inicio y acceso informativo, sin dependencias externas ni errores de JavaScript. La apertura directa desde el sistema de archivos no se pudo verificar en este entorno.

## Etapa 2: autenticación y cuentas

Se verificó la compilación de Next.js con rutas dinámicas privadas y `proxy.ts`, el tipado y el formato. Las pruebas aisladas cubren autorización de altas, validación, cuota, compensación ante errores y la migración SQL con RLS en PostgreSQL mediante PGlite. No se usaron datos reales ni un proyecto Supabase remoto.

En Chromium se comprobaron la portada conservada y el formulario de acceso a 1440, 768, 390 y 320 px, sin desbordamiento; el formulario está deshabilitado sin conexión. Cinco rutas privadas redirigieron a `/login`; una cookie arbitraria no concedió acceso. Se verificó también el cierre sin sesión y el exportador independiente adaptado, sin errores de JavaScript.

La portada, los estilos originales, las ilustraciones, la cabecera, el pie, la navegación y el `index.html` original coinciden con el commit `546b2ff`.

**Pendiente de configuración externa:** login docente y estudiantil con Auth real, renovación de sesión, cierre con sesión real y alta de estudiantes a través de Supabase. No se consideran probados esos flujos remotos. Completar `docs/SUPABASE.md` y realizar sus comprobaciones antes de usar cuentas reales. No se realizó despliegue.
