# Desarrollo por etapas

Cada etapa requiere aprobación antes de comenzar la siguiente. La etapa 1 está conservada. La etapa 2 está implementada en el código y pendiente de conexión y verificación con un proyecto Supabase. No se ha iniciado la etapa 3.

| Etapa                       | Alcance                                                                                        | Verificación necesaria                                                                    |
| --------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1. Estructura inicial       | Next.js, Tailwind, portada, identidad, navegación y componentes                                | Instalación reproducible, TypeScript, compilación, navegación y vista móvil               |
| 2. Autenticación            | Supabase Auth, sesiones, roles, rutas privadas, primer administrador y cuentas básicas         | Inicio y cierre de sesión con ambos roles; rechazar acceso y cambios no autorizados       |
| 3. Administración académica | Años académicos, grados, grupos, asignaturas, periodos, unidades, temas y momentos             | CRUD mediante formularios, integridad de relaciones y aislamiento por grupo y año         |
| 4. Biblioteca               | Carga, vista previa, descarga, publicación y almacenamiento privado                            | PDF autorizado; rechazar archivos inválidos y acceso de otro grupo                        |
| 5. Panel del estudiante     | Inicio, asignaturas, programación, materiales y anuncios                                       | Solo contenido publicado y destinado al grupo del estudiante                              |
| 6. Actividades              | Talleres, entregas privadas, adjuntos, revisión y retroalimentación                            | Entrega, vencimientos, acceso privado y revisión docente                                  |
| 7. Evaluaciones             | Banco de preguntas, ocho tipos, intentos, tiempos, calificación automática/manual y resultados | Límites de servidor, protección de respuestas, duplicados y visibilidad de calificaciones |
| 8. Mejoras y publicación    | Buscador, accesibilidad, optimización, seguridad y despliegue                                  | Pruebas integrales, revisión móvil y verificación del despliegue real                     |

## Arquitectura prevista

App Router separa las rutas públicas de las futuras áreas autenticadas. Los componentes de presentación no contienen credenciales ni datos reales. Las operaciones privilegiadas se implementarán en servidor y verificarán el rol autenticado. La base de datos aplicará RLS independientemente de la interfaz.

En la etapa 3 se diseñarán migraciones versionadas con entidades relacionadas para años, matrículas, asignaciones de grupos y jerarquía académica. Los archivos de estudiantes serán privados. La estructura debe conservar historiales entre años y evitar que los cambios de grupo revelen información ajena.

La administración permitirá formularios visuales y no exigirá editar código. Las funciones de etapas posteriores no se consideran implementadas hasta probar su comportamiento real con Supabase.
