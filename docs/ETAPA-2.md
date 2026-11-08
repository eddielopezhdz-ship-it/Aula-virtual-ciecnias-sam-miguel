# Etapa 2: autenticación y cuentas

## Implementado

- Inicio con correo y contraseña mediante Supabase Auth; cierre de sesión local y renovación de cookies mediante `proxy.ts` de Next.js 16.
- Cookies HttpOnly, SameSite=Lax y Secure en producción; clientes por petición y cabeceras privadas sin caché en las rutas de sesión.
- Roles `teacher` y `student` en PostgreSQL; perfil activo consultado en servidor. No se aceptan roles desde formularios ni metadatos de Auth.
- `/admin` exige docente activo en el servidor, tanto en layout como en cada página y operación. `/aula` exige cuenta activa. No hay rutas de registro público.
- Creación de estudiantes exclusivamente desde una Server Action docente, validación, contraseña aleatoria, cuota persistente de 30 solicitudes por docente y hora y compensación si falla el perfil.
- Listado de los últimos 200 perfiles de estudiantes. El administrador ve la contraseña generada solo al crear la cuenta; no se guarda en nuestra base de datos. Auth conserva su representación segura.
- Inicialización única del primer docente a partir de una cuenta Auth previamente confirmada, sin credenciales predeterminadas.
- Migración con RLS para perfiles, roles y pertenencias a grupos, y registro privado de operaciones. Un estudiante solo puede leer su perfil activo y su propia pertenencia; no puede modificarlos.
- Paneles con navegación preparada; módulos académicos expresamente pendientes.

## Conservado de la etapa 1

La portada, las ilustraciones, los estilos originales, la cabecera, el pie y el archivo `index.html` original. Los nuevos estilos están en `src/app/auth.css`. El acceso del menú continúa en `/login`, ahora con formulario real cuando se configura Supabase. El exportador independiente se adapta para mostrar un aviso de acceso conectado en lugar de intentar exportar una sesión.

## Límites de verificación

No existe un proyecto Supabase conectado en esta entrega. El formulario permanece deshabilitado sin la configuración. La compilación y los tests aislados no acreditan un login real, una sesión renovada o una cuenta creada en Supabase. Es obligatorio completar y probar [la conexión](SUPABASE.md) antes de usar las cuentas.

Las pruebas RLS ejecutan la migración en PostgreSQL mediante PGlite, con un esquema de Auth de prueba. Comprueban políticas y permisos reales de SQL, pero no reemplazan la verificación de Supabase Auth, PostgREST y cookies en un proyecto conectado.

Los tests de creación de cuentas usan un almacén inyectado de prueba para comprobar autorización, cuota y compensación. No se presentan como cuentas remotas creadas.

## Pruebas

```sh
npm run test
npm run typecheck
npm run format:check
npm run build
```

Las pruebas de funcionamiento sin conexión deben comprobar `/login` y el rechazo de accesos privados, tanto en escritorio como en celular. Las pruebas conectadas que debe realizar el administrador están en `SUPABASE.md`.

## No implementado

CRUD académico, materiales, talleres, evaluaciones, calificaciones, matrículas por año, asignación de grupos desde formularios, recuperación automatizada de contraseña y despliegue. Ninguno de los módulos pendientes simula guardar datos.
