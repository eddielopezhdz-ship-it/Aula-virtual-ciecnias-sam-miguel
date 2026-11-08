# Aula Virtual de Ciencias Naturales

Plataforma educativa de la Institución Educativa San Miguel, Aguachica, Cesar, Colombia. Docente: Eddie Johan López Hernández. Área: Ciencias Naturales y Educación Ambiental, grados sexto a undécimo.

## Estado de esta entrega

**Etapa 1: estructura inicial y página principal.** Incluye portada responsive, identidad visual, navegación, componentes reutilizables, páginas informativas de las secciones futuras y página 404. Las ilustraciones son SVG locales; el símbolo de la marca es decorativo y **no es el escudo institucional**. El espacio para el escudo oficial está identificado en la portada.

No hay autenticación, cuentas, paneles privados, base de datos, archivos subidos ni evaluaciones funcionales en esta etapa. Las páginas de acceso, asignaturas, biblioteca, programación y evaluaciones indican que se habilitarán más adelante. Las tarjetas de asignaturas presentan la propuesta del área; no son una programación académica oficial ni materiales publicados.

## Tecnologías

- Next.js 16 con App Router y TypeScript estricto.
- React 19.
- Tailwind CSS 4 mediante PostCSS y estilos compartidos.
- Iconos Lucide e ilustraciones SVG propias; sin fuentes, imágenes o servicios externos en tiempo de ejecución.
- Preparado para desplegar en Vercel o en un servidor compatible con Next.js.

Las versiones exactas están en `package-lock.json`. Usa Node.js 22.13 o posterior compatible (validado con Node.js 24) y npm.

## Instalar y ejecutar

```sh
npm ci
npm run dev
```

Abre la dirección local que indica Next.js (puerto 3000). El servidor escucha en todas las interfaces para permitir su uso dentro de un entorno de desarrollo en la nube. No expongas un servidor de desarrollo como despliegue de producción.

```sh
npm run typecheck
npm run build
npm start
```

`build` genera la aplicación de producción; `start` sirve esa compilación. Detén un servidor anterior si ya utiliza el puerto 3000. No se necesitan claves ni conexión a Supabase para la etapa 1.

## Estructura

```text
src/app/                 Rutas App Router, layout, estilos y metadatos
src/components/          Marca, cabecera, pie, ilustración y estados informativos
src/lib/subjects.ts      Datos de presentación de las asignaturas
.env.example             Nombres reservados para la futura integración Supabase
next.config.ts           Configuración y cabeceras HTTP de seguridad
postcss.config.mjs       Integración de Tailwind
docs/                    Plan por etapas y guía inicial del docente
```

## Supabase y usuarios: siguiente etapa

No hay migraciones ni conexión activa a Supabase en esta entrega. `.env.example` documenta los nombres previstos; no es necesario completarlo ahora. En la etapa 2 se implementarán las sesiones, perfiles, roles, RLS y el procedimiento seguro para crear el primer administrador, sin contraseñas predeterminadas ni registro público de estudiantes.

Cuando esa integración esté disponible, las variables se configurarán mediante `.env.local` (ignorado por Git) o los secretos del proveedor de despliegue. La clave administrativa `SUPABASE_SERVICE_ROLE_KEY` será exclusiva del servidor y nunca llevará el prefijo `NEXT_PUBLIC_`. No compartas claves por chat ni las incluyas en el repositorio.

La creación de estudiantes y los permisos quedan pendientes de la etapa 2. Las políticas sobre tratamiento de datos de menores y las autorizaciones institucionales deberán definirse antes de usar información real.

## Publicación de la etapa 1

1. Importa este repositorio en Vercel y selecciona el framework Next.js.
2. Utiliza Node.js 24, instalación `npm ci` y compilación `npm run build`.
3. Esta versión no requiere variables de entorno ni servicios externos.
4. Publica desde Vercel. Para un dominio propio, agrégalo en la configuración del proyecto y aplica los registros DNS que indique el proveedor.
5. Comprueba la portada, las rutas del menú, el botón de acceso, una dirección inexistente y la vista móvil. Revisa HTTPS y la consola del navegador.

También es compatible con un servidor Node.js que ejecute `npm ci`, `npm run build` y `npm start`, detrás de un proxy HTTPS.

**No se ha realizado un despliegue remoto.** Una compilación local no acredita que la aplicación ya esté publicada.

## Documentación

- [Plan y criterios por etapa](docs/PLAN.md)
- [Guía inicial del docente](docs/GUIA-DOCENTE.md)
- [Verificaciones de esta entrega](docs/VALIDACION.md)

## Abrir como un index independiente

Abre `index.html` directamente en un navegador. Incluye los estilos, ilustraciones y las páginas informativas de la etapa 1; no requiere instalar Node.js ni conectarse a Internet. El menú funciona con rutas dentro del mismo archivo.

Para regenerarlo después de cambiar el código:

```sh
npm run export:index
```

El archivo es una copia de presentación de la etapa 1. Las funciones de autenticación y de gestión académica siguen pendientes.
