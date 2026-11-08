# Aula Virtual de Ciencias Naturales

Plataforma educativa de la Institución Educativa San Miguel, Aguachica, Cesar, Colombia. Docente: Eddie Johan López Hernández. Área: Ciencias Naturales y Educación Ambiental, grados sexto a undécimo.

## Estado de esta entrega

**Etapa 2: autenticación y cuentas implementadas, pendientes de conexión a un proyecto Supabase.** La portada y el diseño de la etapa 1 se conservan. Se añadieron login, sesiones de servidor, perfiles y roles con RLS, paneles privados y creación de cuentas estudiantiles por el docente.

No hay proyecto Supabase configurado en el entorno. Sin sus variables, el formulario muestra conexión pendiente y las rutas privadas rechazan el acceso. Las pruebas aisladas no acreditan que ya funcionen cuentas remotas.

Los módulos académicos siguen pendientes: asignaturas, programación, materiales, actividades, evaluaciones y calificaciones. Sus pantallas no simulan guardados. El `index.html` original conserva la presentación de la etapa 1; la autenticación necesita la aplicación Next.js y Supabase.

## Tecnologías

- Next.js 16 con App Router y TypeScript estricto.
- React 19.
- Supabase Auth, PostgreSQL y `@supabase/ssr` para sesiones.
- Zod para validación; Node test runner y PGlite para pruebas aisladas.
- Tailwind CSS 4 mediante PostCSS y estilos compartidos.
- Iconos Lucide e ilustraciones SVG propias; recursos visuales locales, sin fuentes ni imágenes remotas.
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

## Supabase y usuarios

Sigue [Configuración de Supabase](docs/SUPABASE.md) para crear el proyecto, desactivar el registro público, aplicar la migración y configurar las variables de `.env.example` en `.env.local` o el mecanismo seguro del entorno. No envíes claves por chat ni las guardes en Git.

Después crea tu cuenta Auth confirmada desde Supabase y ejecuta el procedimiento de administrador inicial documentado. No existen contraseñas predeterminadas ni roles obtenidos desde metadatos del usuario.

Las rutas `/admin` y `/admin/estudiantes` exigen docente activo. `/aula` exige cuenta activa. Los estudiantes solo pueden ser creados por el docente mediante una operación del servidor. Los módulos futuros no permiten consultar datos académicos todavía.

```sh
npm run test
npm run typecheck
npm run build
npm start
```

Consulta [Estado y límites de la etapa 2](docs/ETAPA-2.md). Antes de usar información real de menores, deben definirse los procedimientos institucionales de privacidad.

## Despliegue futuro (no realizado)

1. Importa este repositorio en Vercel y selecciona el framework Next.js.
2. Utiliza Node.js 24, instalación `npm ci` y compilación `npm run build`.
3. Para habilitar el acceso privado, configura las tres variables de Supabase y aplica la migración. La portada pública puede compilarse sin conexión; el acceso no funcionará así.
4. Publica desde Vercel. Para un dominio propio, agrégalo en la configuración del proyecto y aplica los registros DNS que indique el proveedor.
5. Comprueba la portada, las rutas del menú, el botón de acceso, una dirección inexistente y la vista móvil. Revisa HTTPS y la consola del navegador.

También es compatible con un servidor Node.js que ejecute `npm ci`, `npm run build` y `npm start`, detrás de un proxy HTTPS.

**No se ha realizado un despliegue remoto.** Una compilación local no acredita que la aplicación ya esté publicada.

## Documentación

- [Configuración de Supabase](docs/SUPABASE.md)
- [Estado de la etapa 2](docs/ETAPA-2.md)
- [Plan y criterios por etapa](docs/PLAN.md)
- [Guía inicial del docente](docs/GUIA-DOCENTE.md)
- [Verificaciones de esta entrega](docs/VALIDACION.md)

## Abrir como un index independiente

Abre `index.html` directamente en un navegador. Incluye los estilos, ilustraciones y las páginas informativas de la etapa 1; no requiere instalar Node.js ni conectarse a Internet. El menú funciona con rutas dentro del mismo archivo.

Para regenerarlo después de cambiar el código:

```sh
npm run export:index
```

El archivo es una copia de presentación independiente. La autenticación requiere ejecutar la aplicación Next.js con Supabase configurado. Las funciones académicas siguen pendientes.
