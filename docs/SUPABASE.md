# Conectar Supabase: pasos personales del administrador

La etapa 2 está implementada en el código, pero este entorno no tiene todavía un proyecto Supabase ni sus variables. No se han creado cuentas reales. Las siguientes acciones se realizan en tu propia cuenta de Supabase, sin enviar claves por chat.

## 1. Crear el proyecto

1. Entra en https://supabase.com/dashboard y crea un proyecto dedicado a la institución.
2. Selecciona la organización, el nombre y una región adecuada. Crea una contraseña de base de datos robusta y guárdala en un gestor de contraseñas. Esta contraseña no se necesita en la aplicación.
3. Espera a que la base de datos y Auth estén disponibles.

## 2. Cerrar el registro público

En **Authentication → Sign In / Providers** (o la sección equivalente en la versión actual del panel):

- Mantén habilitado el inicio de sesión por correo y contraseña.
- Desactiva **Allow new users to sign up**. No basta con ocultar un botón en nuestra interfaz: el servicio Auth también debe rechazar las inscripciones públicas.
- No habilites proveedores externos para esta etapa.
- Conserva los límites de solicitudes de Auth. Revisa **Rate Limits**, protección de contraseñas y los registros de accesos fallidos según el plan contratado.
- Usa HTTPS cuando llegue el despliegue. Durante el desarrollo, configura la URL del sitio como `http://localhost:3000`. No agregues comodines a las URL permitidas. Esta entrega no utiliza enlaces mágicos, OAuth ni recuperación por correo.

La creación mediante `auth.admin.createUser` seguirá disponible para nuestro servidor autorizado, aunque el registro público esté deshabilitado.

## 3. Aplicar la migración

Abre **SQL Editor** y ejecuta una sola vez el contenido completo de:

`supabase/migrations/202611080001_auth_accounts.sql`

También se puede aplicar mediante Supabase CLI y `supabase db push` en un proyecto vinculado. No hace falta la CLI para el procedimiento con SQL Editor.

La migración crea roles, perfiles, estructura mínima de pertenencia a grupos y un registro privado de solicitudes de creación de cuentas. Activa RLS y revoca el acceso anónimo. No contiene cuentas ni contraseñas de ejemplo. No la ejecutes sobre tablas del mismo nombre que ya contengan información: revisa primero cualquier conflicto con un técnico.

El esquema `private` no debe incluirse entre los esquemas expuestos por la API. Los recursos educativos y Storage aún no se implementan: no crees buckets públicos para estudiantes como sustituto.

## 4. Configurar las variables

En **Project Settings → API / API Keys**, identifica la URL, la clave **publishable** y la clave heredada **service_role** (secreta; no es la contraseña de la base de datos).

Copia `.env.example` a `.env.local` en tu máquina de desarrollo y completa los valores allí, mediante tu editor local o la configuración segura del entorno:

| Variable                               | Uso                                                                |
| -------------------------------------- | ------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL del proyecto                                                   |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave pública del proyecto; no otorga privilegios administrativos  |
| `SUPABASE_SERVICE_ROLE_KEY`            | Clave privada exclusiva del servidor; necesaria para crear cuentas |

Nunca publiques `.env.local`, capturas de las claves ni archivos con credenciales. La clave administrativa no debe tener prefijo `NEXT_PUBLIC_`. Si se expone, rótala inmediatamente desde Supabase y actualiza la configuración segura.

Reinicia Next.js después de configurar las variables. La URL y la clave pública también deben estar presentes al compilar. Con la URL y la clave pública el acceso puede funcionar; sin la clave privada, el panel deshabilita la creación de cuentas.

## 5. Crear el primer administrador

1. En **Authentication → Users → Add user → Create new user**, crea tu propia cuenta con un correo bajo tu control y una contraseña única, elegida por ti o generada por un gestor. No utilices el ejemplo de una prueba ni una contraseña basada en nombres o fechas.
2. Confirma la cuenta con la opción de confirmación del panel. El procedimiento requiere `email_confirmed_at` no nulo.
3. Copia únicamente el UUID de ese usuario de Auth.
4. Desde la raíz del repositorio, con `.env.local` configurado, ejecuta:

```sh
npm run bootstrap:admin -- UUID_DEL_USUARIO "Nombre completo del docente"
```

`UUID_DEL_USUARIO` debe reemplazarse por el UUID real; no es una credencial. El script no recibe ni imprime contraseñas. La función se ejecuta exclusivamente con la clave del servidor y rechaza una segunda inicialización si ya existe un docente.

Como alternativa, después de crear el usuario de Auth puedes ejecutar desde el SQL Editor de tu propio proyecto:

```sql
-- Sustituye el marcador por el UUID de la cuenta que acabas de crear.
select public.bootstrap_teacher('UUID_DEL_USUARIO'::uuid, 'Nombre completo del docente');
```

La clave de servidor y el SQL Editor son herramientas privilegiadas. No compartas su acceso con estudiantes. No asignes el rol mediante los metadatos de Auth: la aplicación consulta el perfil protegido en PostgreSQL.

## 6. Probar con datos ficticios

1. Ejecuta `npm ci`, `npm run test`, `npm run build` y `npm start`.
2. Ingresa en `/login` con la cuenta del docente. Debe llevarte a `/admin`.
3. En **Estudiantes**, crea una cuenta de prueba usando un correo de prueba bajo tu control y un nombre ficticio. El servidor generará una contraseña aleatoria de 24 caracteres.
4. Entrega la contraseña de forma privada. Solo se presenta en la respuesta de creación; no se almacena en nuestra base de datos ni en archivos. Si se pierde antes de entregarla, no hay recuperación automática implementada en esta etapa.
5. En otra ventana privada, inicia sesión con esa cuenta. Debe abrir `/aula`. Si escribes `/admin`, debe rechazar el acceso.
6. Cierra sesión y comprueba que volver a una ruta privada exige ingresar de nuevo.
7. Desde las herramientas de desarrollo, verifica que el estudiante no puede insertar perfiles, editar su rol ni consultar perfiles ajenos. Las pruebas automatizadas incluidas verifican estas políticas en PostgreSQL aislado.
8. Confirma que no existe registro público y que tampoco funciona un intento directo de inscripción mediante el SDK de Auth.
9. Retira las cuentas ficticias de Auth al terminar si no las necesitas; sus perfiles se eliminan en cascada.

Los nombres y correos de las pruebas del repositorio son ficticios. Los correos `example.invalid` no deben usarse para envíos reales.

## Qué queda pendiente

- Verificar login, renovación de sesión, cierre de sesión y creación de cuentas contra **tu proyecto real** después de completar esta guía.
- Gestión visual de grupos, asignaciones, recursos y permisos académicos: próximas etapas. La estructura de grupos actual solo prepara el aislamiento de acceso.
- Recuperación de contraseña, importación CSV y administración avanzada de cuentas: no implementadas en esta entrega.
- Almacenamiento de documentos y archivos estudiantiles: no implementado.
- Publicación en Internet: no realizada ni autorizada en esta etapa.

Antes de usar datos reales de menores, la institución debe definir sus autorizaciones, información de privacidad y procedimientos de protección de datos. El código no reemplaza esos procedimientos.

## Referencias oficiales

- Supabase SSR para Next.js: https://supabase.com/docs/guides/auth/server-side/nextjs
- Ejemplo oficial Next.js: https://github.com/vercel/next.js/tree/canary/examples/with-supabase
- RLS: https://supabase.com/docs/guides/database/postgres/row-level-security
- Administración de usuarios: https://supabase.com/docs/reference/javascript/auth-admin-createuser

La implementación adapta el patrón oficial `createServerClient`, `cookies().getAll/setAll` y `proxy.ts`. Utiliza `getUser()` para verificar la identidad con Auth y comprueba además el perfil activo y su rol en la base de datos, sin confiar en `getSession()` ni en metadatos editables del usuario. Las cookies son HttpOnly; no hay cliente Supabase de navegador en esta etapa.
