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
